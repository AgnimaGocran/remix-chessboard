import type { Arrow, ArrowOptions } from './arrow.ts';
import type { ChessboardOptions } from './board_options.ts';
import type { BoardStyle, NamedStyles } from './board_style.ts';
import {
	defaultAlphaNotationStyle,
	defaultArrowOptions,
	defaultBoardStyle,
	defaultDarkSquareNotationStyle,
	defaultDarkSquareStyle,
	defaultDropSquareStyle,
	defaultLightSquareNotationStyle,
	defaultLightSquareStyle,
	defaultNumericNotationStyle,
	defaultSquareStyle,
	defaultSquareStyles,
} from './defaults.ts';
import type {
	PieceDropHandlerArgs,
	PieceHandlerArgs,
	SquareHandlerArgs,
} from './handler_args.ts';
import { defaultPieces } from './pieces.ts';
import type { PositionDataType } from './position_data.ts';
import type {
	PieceRenderObject,
	SquareRenderer,
} from './renderer_types.ts';

export interface ResolvedBoardOptions {
	id: string;
	pieces: PieceRenderObject;
	position: string | PositionDataType;
	boardOrientation: 'white' | 'black';
	chessboardRows: number;
	chessboardColumns: number;
	boardStyle: BoardStyle;
	squareStyle: BoardStyle;
	squareStyles: NamedStyles;
	darkSquareStyle: BoardStyle;
	lightSquareStyle: BoardStyle;
	dropSquareStyle: BoardStyle;
	darkSquareNotationStyle: BoardStyle;
	lightSquareNotationStyle: BoardStyle;
	alphaNotationStyle: BoardStyle;
	numericNotationStyle: BoardStyle;
	showNotation: boolean;
	animationDurationInMs: number;
	showAnimations: boolean;
	allowDragging: boolean;
	allowDragOffBoard: boolean;
	allowAutoScroll: boolean;
	dragActivationDistance: number;
	allowDrawingArrows: boolean;
	arrows: Arrow[];
	arrowOptions: ArrowOptions;
	clearArrowsOnClick: boolean;
	clearArrowsOnPositionChange: boolean;
	canDragPiece: ((args: PieceHandlerArgs) => boolean) | null;
	onArrowsChange: ((args: { arrows: Arrow[] }) => void) | null;
	onMouseOutSquare: ((args: SquareHandlerArgs) => void) | null;
	onMouseOverSquare: ((args: SquareHandlerArgs) => void) | null;
	onPieceClick: ((args: PieceHandlerArgs) => void) | null;
	onPieceDrag: ((args: PieceHandlerArgs) => void) | null;
	onPieceDragCancel: (() => void) | null;
	onPieceDrop: ((args: PieceDropHandlerArgs) => boolean) | null;
	onSquareClick: ((args: SquareHandlerArgs) => void) | null;
	onSquareMouseDown: ((args: SquareHandlerArgs, event: MouseEvent) => void) | null;
	onSquareMouseUp: ((args: SquareHandlerArgs, event: MouseEvent) => void) | null;
	onSquareRightClick: ((args: SquareHandlerArgs) => void) | null;
	squareRenderer: SquareRenderer | null;
}

export function resolveBoardOptions(options: ChessboardOptions): ResolvedBoardOptions {
	const chessboardColumns = options.chessboardColumns ?? 8;
	return {
		id: options.id ?? 'chessboard',
		pieces: options.pieces ?? defaultPieces,
		position: options.position ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
		boardOrientation: options.boardOrientation ?? 'white',
		chessboardRows: options.chessboardRows ?? 8,
		chessboardColumns,
		boardStyle: options.boardStyle ?? defaultBoardStyle(chessboardColumns),
		squareStyle: options.squareStyle ?? defaultSquareStyle,
		squareStyles: options.squareStyles ?? defaultSquareStyles,
		darkSquareStyle: options.darkSquareStyle ?? defaultDarkSquareStyle,
		lightSquareStyle: options.lightSquareStyle ?? defaultLightSquareStyle,
		dropSquareStyle: options.dropSquareStyle ?? defaultDropSquareStyle,
		darkSquareNotationStyle:
			options.darkSquareNotationStyle ?? defaultDarkSquareNotationStyle,
		lightSquareNotationStyle:
			options.lightSquareNotationStyle ?? defaultLightSquareNotationStyle,
		alphaNotationStyle: options.alphaNotationStyle ?? defaultAlphaNotationStyle,
		numericNotationStyle: options.numericNotationStyle ?? defaultNumericNotationStyle,
		showNotation: options.showNotation ?? true,
		animationDurationInMs: options.animationDurationInMs ?? 300,
		showAnimations: options.showAnimations ?? true,
		allowDragging: options.allowDragging ?? true,
		allowDragOffBoard: options.allowDragOffBoard ?? true,
		allowAutoScroll: options.allowAutoScroll ?? false,
		dragActivationDistance: options.dragActivationDistance ?? 1,
		allowDrawingArrows: options.allowDrawingArrows ?? true,
		arrows: options.arrows ?? [],
		arrowOptions: options.arrowOptions ?? defaultArrowOptions,
		clearArrowsOnClick: options.clearArrowsOnClick ?? true,
		clearArrowsOnPositionChange: options.clearArrowsOnPositionChange ?? true,
		canDragPiece: options.canDragPiece ?? null,
		onArrowsChange: options.onArrowsChange ?? null,
		onMouseOutSquare: options.onMouseOutSquare ?? null,
		onMouseOverSquare: options.onMouseOverSquare ?? null,
		onPieceClick: options.onPieceClick ?? null,
		onPieceDrag: options.onPieceDrag ?? null,
		onPieceDragCancel: options.onPieceDragCancel ?? null,
		onPieceDrop: options.onPieceDrop ?? null,
		onSquareClick: options.onSquareClick ?? null,
		onSquareMouseDown: options.onSquareMouseDown ?? null,
		onSquareMouseUp: options.onSquareMouseUp ?? null,
		onSquareRightClick: options.onSquareRightClick ?? null,
		squareRenderer: options.squareRenderer ?? null,
	};
}