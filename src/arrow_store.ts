import type { ArrowModifiers } from './arrow.ts';
import type { BoardState } from './board_state.ts';
import type { ResolvedBoardOptions } from './resolved_options.ts';

export interface ArrowController {
	startArrow(square: string): void;
	cancelArrow(): void;
	clearArrows(): void;
	setArrowOver(square: string | null, modifiers: ArrowModifiers): void;
	finishArrow(square: string, modifiers: ArrowModifiers): void;
}

export function createArrowController(
	getOptions: () => ResolvedBoardOptions,
	getState: () => BoardState,
	patch: (partial: Partial<BoardState>) => void,
): ArrowController {
	function arrowColor(modifiers: ArrowModifiers): string {
		const colors = getOptions().arrowOptions.colors;
		if (modifiers.altKey) {
			return colors.alt;
		}
		if (modifiers.shiftKey) {
			return colors.shift;
		}
		if (modifiers.ctrlKey) {
			return colors.ctrl;
		}
		if (modifiers.metaKey) {
			return colors.meta;
		}
		return colors.default;
	}

	return {
		startArrow(square: string): void {
			if (!getOptions().allowDrawingArrows) {
				return;
			}
			patch({ arrowStartSquare: square, arrowOver: null });
		},
		cancelArrow(): void {
			patch({ arrowStartSquare: null, arrowOver: null });
		},
		clearArrows(): void {
			if (!getOptions().clearArrowsOnClick) {
				return;
			}
			const state = getState();
			if (state.arrows.length === 0 && state.arrowStartSquare === null) {
				return;
			}
			patch({ arrows: [], arrowStartSquare: null, arrowOver: null });
			getOptions().onArrowsChange?.({ arrows: [] });
		},
		setArrowOver(square: string | null, modifiers: ArrowModifiers): void {
			if (!getOptions().allowDrawingArrows || getState().arrowStartSquare === null) {
				return;
			}
			if (square === null || square === getState().arrowStartSquare) {
				patch({ arrowOver: null });
				return;
			}
			patch({ arrowOver: { square, color: arrowColor(modifiers) } });
		},
		finishArrow(square: string, modifiers: ArrowModifiers): void {
			if (!getOptions().allowDrawingArrows) {
				return;
			}
			const state = getState();
			const start = state.arrowStartSquare;
			if (start === null || start === square) {
				patch({ arrowStartSquare: null, arrowOver: null });
				return;
			}
			const existsExternally = getOptions().arrows.some(
				(arrow) => arrow.startSquare === start && arrow.endSquare === square,
			);
			if (existsExternally) {
				patch({ arrowStartSquare: null, arrowOver: null });
				return;
			}
			const existingIndex = state.arrows.findIndex(
				(arrow) => arrow.startSquare === start && arrow.endSquare === square,
			);
			const arrows =
				existingIndex === -1
					? [
							...state.arrows,
							{ startSquare: start, endSquare: square, color: arrowColor(modifiers) },
						]
					: state.arrows.filter((_, index) => index !== existingIndex);
			patch({ arrows, arrowStartSquare: null, arrowOver: null });
			getOptions().onArrowsChange?.({ arrows });
		},
	};
}