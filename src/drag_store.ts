import {
	Accessibility,
	AutoScroller,
	Cursor,
	DragDropManager,
	type DragEndEvent,
	Draggable,
	type DragMoveEvent,
	type DragOverEvent,
	type DragStartEvent,
	Droppable,
	Feedback,
	KeyboardSensor,
	PointerActivationConstraints,
	PointerSensor,
	PreventSelection,
} from '@dnd-kit/dom';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import type { BoardState } from './board_state.ts';
import type { DraggingPieceDataType } from './piece_data.ts';
import type { PieceOnSquare } from './position_data.ts';
import type { ManualDrop } from './position_transition.ts';
import type { ResolvedBoardOptions } from './resolved_options.ts';

export interface DragController {
	canDrag(dragging: DraggingPieceDataType): boolean;
	attachSquare(square: string, element: HTMLElement, signal: AbortSignal): void;
	attachPiece(square: string, element: HTMLElement, signal: AbortSignal): void;
	destroy(): void;
}

export interface DragControllerDeps {
	getOptions: () => ResolvedBoardOptions;
	getState: () => BoardState;
	patch: (partial: Partial<BoardState>) => void;
	pieceAt(square: string): PieceOnSquare | null;
	markManualDrop(drop: ManualDrop): void;
}

export function createDragController({
	getOptions,
	getState,
	patch,
	pieceAt,
	markManualDrop,
}: DragControllerDeps): DragController {
	let manager: DragDropManager | null = null;
	const droppables = new Set<Droppable>();

	function handleDragStart(event: DragStartEvent): void {
		const source = event.operation.source;
		if (source === null) {
			return;
		}
		const square = String(source.id);
		const piece = pieceAt(square);
		if (piece === null) {
			return;
		}
		getOptions().onPieceDrag?.({
			isSparePiece: false,
			piece: { pieceType: piece.pieceType },
			square,
		});
		patch({
			dragging: { isSparePiece: false, position: square, pieceType: piece.pieceType },
			overSquare: null,
		});
	}

	function handleOver(event: DragMoveEvent | DragOverEvent): void {
		const target = event.operation.target;
		const square = target === null ? null : String(target.id);
		if (getState().overSquare === square) {
			return;
		}
		patch({ overSquare: square });
	}

	function handleDragEnd(event: DragEndEvent): void {
		const source = event.operation.source;
		const target = event.operation.target;
		const dragging = getState().dragging;
		if (dragging !== null && source !== null) {
			const targetSquare = target === null ? null : String(target.id);
			const valid =
				getOptions().onPieceDrop?.({
					piece: dragging,
					sourceSquare: String(source.id),
					targetSquare,
				}) ?? false;
			if (valid || targetSquare === null) {
				markManualDrop({
					piece: dragging.pieceType,
					sourceSquare: dragging.position,
					targetSquare: targetSquare ?? '',
				});
			}
		}
		patch({ dragging: null, overSquare: null });
	}

	function canDrag(dragging: DraggingPieceDataType): boolean {
		const options = getOptions();
		if (!options.allowDragging) {
			return false;
		}
		if (options.canDragPiece === null) {
			return true;
		}
		return options.canDragPiece({
			isSparePiece: dragging.isSparePiece,
			piece: { pieceType: dragging.pieceType },
			square: dragging.isSparePiece ? null : dragging.position,
		});
	}

	function canDragSource(source: Draggable): boolean {
		const id = String(source.id);
		if (!/\d$/.test(id)) {
			return canDrag({ isSparePiece: true, position: id, pieceType: id });
		}
		const piece = pieceAt(id);
		if (piece === null) {
			return false;
		}
		return canDrag({ isSparePiece: false, position: id, pieceType: piece.pieceType });
	}

	function ensureManager(): DragDropManager {
		if (manager !== null) {
			return manager;
		}
		const options = getOptions();
		const instance = new DragDropManager({
			sensors: [
				PointerSensor.configure({
					activationConstraints: [
						new PointerActivationConstraints.Distance({
							value: Math.max(1, options.dragActivationDistance),
						}),
					],
					preventActivation: (_event: PointerEvent, source: Draggable) =>
						!canDragSource(source),
				}),
				KeyboardSensor.configure({
					preventActivation: (_event: KeyboardEvent, source: Draggable) =>
						!canDragSource(source),
				}),
			],
			modifiers: [
				RestrictToElement.configure({
					element: () => document.getElementById(`${options.id}-board`),
				}),
			],
			plugins: [
				Accessibility,
				AutoScroller,
				Cursor.configure({ cursor: 'grabbing' }),
				Feedback.configure({ feedback: 'clone', dropAnimation: null }),
				PreventSelection,
			],
		});
		instance.monitor.addEventListener('dragstart', handleDragStart);
		instance.monitor.addEventListener('dragmove', handleOver);
		instance.monitor.addEventListener('dragover', handleOver);
		instance.monitor.addEventListener('dragend', handleDragEnd);
		manager = instance;
		return instance;
	}

	return {
		canDrag,
		attachSquare(square: string, element: HTMLElement, signal: AbortSignal): void {
			const droppable = new Droppable({ id: square, element }, ensureManager());
			droppables.add(droppable);
			signal.addEventListener('abort', () => {
				droppables.delete(droppable);
				droppable.destroy();
			});
		},
		attachPiece(square: string, element: HTMLElement, signal: AbortSignal): void {
			const draggable = new Draggable({ id: square, element }, ensureManager());
			signal.addEventListener('abort', () => {
				draggable.destroy();
			});
		},
		destroy(): void {
			for (const droppable of droppables) {
				droppable.destroy();
			}
			droppables.clear();
			if (manager !== null) {
				manager.destroy();
				manager = null;
			}
		},
	};
}