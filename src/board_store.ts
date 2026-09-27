import type { ArrowModifiers } from './arrow.ts';
import { createArrowController } from './arrow_store.ts';
import type { BoardState } from './board_state.ts';
import { createBoardState } from './board_state.ts';
import { createDragController } from './drag_store.ts';
import type { DraggingPieceDataType } from './piece_data.ts';
import type { PieceOnSquare, PositionDataType } from './position_data.ts';
import { createPositionTransition } from './position_transition.ts';
import {
	fenStringToPositionObject,
	generateBoard,
} from './position_utils.ts';
import type { ResolvedBoardOptions } from './resolved_options.ts';

export interface BoardStore {
	state: BoardState;
	options: ResolvedBoardOptions;
	syncDimensions(): void;
	syncPosition(input: string | PositionDataType): void;
	pieceAt(square: string): PieceOnSquare | null;
	canDrag(dragging: DraggingPieceDataType): boolean;
	attachSquare(square: string, element: HTMLElement, signal: AbortSignal): void;
	attachPiece(square: string, element: HTMLElement, signal: AbortSignal): void;
	destroy(): void;
	startArrow(square: string): void;
	cancelArrow(): void;
	clearArrows(): void;
	setArrowOver(square: string | null, modifiers: ArrowModifiers): void;
	finishArrow(square: string, modifiers: ArrowModifiers): void;
}

export function createBoardStore(
	options: ResolvedBoardOptions,
	notify: () => void,
): BoardStore {
	let currentOptions = options;
	const getOptions = (): ResolvedBoardOptions => currentOptions;
	let board = generateBoard(
		options.chessboardRows,
		options.chessboardColumns,
		options.boardOrientation,
	);
	let boardOrientation = currentOptions.boardOrientation;
	let lastInput: string | PositionDataType = currentOptions.position;
	let state: BoardState = createBoardState(board);
	state = { ...state, position: toPosition(currentOptions.position) };

	function patch(partial: Partial<BoardState>): void {
		state = { ...state, ...partial };
		notify();
	}

	function toPosition(input: string | PositionDataType): PositionDataType {
		return typeof input === 'string'
			? fenStringToPositionObject(
					input,
					currentOptions.chessboardRows,
					currentOptions.chessboardColumns,
				)
			: input;
	}

	function pieceAt(square: string): PieceOnSquare | null {
		return state.position[square] ?? null;
	}

	const transition = createPositionTransition({
		getPosition: () => state.position,
		getDifferences: () => state.positionDifferences,
		setPosition: (position) => patch({ position }),
		setDifferences: (positionDifferences) => patch({ positionDifferences }),
		showAnimations: () => currentOptions.showAnimations,
		animationDurationInMs: () => currentOptions.animationDurationInMs,
		chessboardRows: () => currentOptions.chessboardRows,
		chessboardColumns: () => currentOptions.chessboardColumns,
		boardOrientation: () => currentOptions.boardOrientation,
	});

	const drag = createDragController({
		getOptions,
		getState: () => state,
		patch,
		pieceAt,
		markManualDrop: (drop) => transition.markManualDrop(drop),
	});

	const arrow = createArrowController(getOptions, () => state, patch);

	return {
		get state() {
			return state;
		},
		get options() {
			return currentOptions;
		},
		set options(next: ResolvedBoardOptions) {
			currentOptions = next;
		},
		syncDimensions(): void {
			if (
				currentOptions.chessboardRows === board.length &&
				currentOptions.chessboardColumns === (board[0]?.length ?? 0) &&
				currentOptions.boardOrientation === boardOrientation
			) {
				return;
			}
			board = generateBoard(
				currentOptions.chessboardRows,
				currentOptions.chessboardColumns,
				currentOptions.boardOrientation,
			);
			boardOrientation = currentOptions.boardOrientation;
			lastInput = currentOptions.position;
			patch({
				board,
				position: toPosition(currentOptions.position),
				positionDifferences: {},
			});
		},
		syncPosition(input: string | PositionDataType): void {
			if (input === lastInput) {
				return;
			}
			lastInput = input;
			if (currentOptions.clearArrowsOnPositionChange && currentOptions.clearArrowsOnClick) {
				state = { ...state, arrows: [], arrowStartSquare: null, arrowOver: null };
			}
			transition.apply(toPosition(input));
		},
		pieceAt,
		canDrag: drag.canDrag,
		attachSquare: drag.attachSquare,
		attachPiece: drag.attachPiece,
		destroy: drag.destroy,
		startArrow: arrow.startArrow,
		cancelArrow: arrow.cancelArrow,
		clearArrows: arrow.clearArrows,
		setArrowOver: arrow.setArrowOver,
		finishArrow: arrow.finishArrow,
	};
}