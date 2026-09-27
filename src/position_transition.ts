import { getPositionUpdates } from './animation_utils.ts';
import type { PositionDataType } from './position_data.ts';
import { getPromotionUpdates } from './promotion_utils.ts';

export interface ManualDrop {
	piece: string;
	sourceSquare: string;
	targetSquare: string;
}

export interface PositionTransition {
	apply(next: PositionDataType): void;
	markManualDrop(drop: ManualDrop): void;
}

export interface TransitionDeps {
	getPosition(): PositionDataType;
	getDifferences(): Record<string, string>;
	setPosition(position: PositionDataType): void;
	setDifferences(differences: Record<string, string>): void;
	showAnimations(): boolean;
	animationDurationInMs(): number;
	chessboardRows(): number;
	chessboardColumns(): number;
	boardOrientation(): 'white' | 'black';
}

export function createPositionTransition(deps: TransitionDeps): PositionTransition {
	let manuallyDropped: ManualDrop | null = null;
	let waiting: PositionDataType | null = null;
	let timer: ReturnType<typeof setTimeout> | null = null;

	function schedule(target: PositionDataType): void {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			timer = null;
			deps.setPosition(target);
			deps.setDifferences({});
			waiting = null;
		}, deps.animationDurationInMs());
	}

	function apply(next: PositionDataType): void {
		const animated = deps.showAnimations() && typeof document !== 'undefined';
		if (!animated) {
			deps.setPosition(next);
			deps.setDifferences({});
			manuallyDropped = null;
			return;
		}
		if (waiting !== null) {
			deps.setPosition(waiting);
			waiting = null;
		}
		const from = deps.getPosition();
		const updates = getPositionUpdates(
			from,
			next,
			deps.chessboardColumns(),
			deps.boardOrientation(),
		);
		if (manuallyDropped !== null) {
			if (Object.keys(updates).length > 1) {
				const intermediate: PositionDataType = { ...from };
				delete intermediate[manuallyDropped.sourceSquare];
				intermediate[manuallyDropped.targetSquare] = {
					pieceType: manuallyDropped.piece,
				};
				const others = { ...updates };
				delete others[manuallyDropped.sourceSquare];
				deps.setPosition(intermediate);
				deps.setDifferences(others);
				manuallyDropped = null;
				schedule(next);
				return;
			}
			deps.setPosition(next);
			deps.setDifferences({});
			manuallyDropped = null;
			return;
		}
		if (Object.keys(updates).length === 0) {
			const promotions = getPromotionUpdates(
				from,
				next,
				deps.chessboardRows(),
				deps.chessboardColumns(),
			);
			if (Object.keys(promotions).length === 1) {
				deps.setDifferences(promotions);
				waiting = next;
				schedule(next);
				return;
			}
		}
		deps.setDifferences(updates);
		waiting = next;
		schedule(next);
	}

	return {
		apply,
		markManualDrop(drop: ManualDrop): void {
			manuallyDropped = drop;
		},
	};
}