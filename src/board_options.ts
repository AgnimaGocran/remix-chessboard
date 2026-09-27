import type { Arrow, ArrowOptions } from './arrow.ts';
import type { BoardStyle, NamedStyles } from './board_style.ts';
import type {
	PieceDropHandlerArgs,
	PieceHandlerArgs,
	SquareHandlerArgs,
} from './handler_args.ts';
import type { PositionDataType } from './position_data.ts';
import type {
	PieceRenderObject,
	SquareRenderer,
} from './renderer_types.ts';

export interface ChessboardOptions {
	id?: string;
	pieces?: PieceRenderObject;
	position?: string | PositionDataType;
	boardOrientation?: 'white' | 'black';
	chessboardRows?: number;
	chessboardColumns?: number;
	boardStyle?: BoardStyle;
	squareStyle?: BoardStyle;
	squareStyles?: NamedStyles;
	darkSquareStyle?: BoardStyle;
	lightSquareStyle?: BoardStyle;
	dropSquareStyle?: BoardStyle;
	darkSquareNotationStyle?: BoardStyle;
	lightSquareNotationStyle?: BoardStyle;
	alphaNotationStyle?: BoardStyle;
	numericNotationStyle?: BoardStyle;
	showNotation?: boolean;
	animationDurationInMs?: number;
	showAnimations?: boolean;
	allowDragging?: boolean;
	allowDragOffBoard?: boolean;
	allowAutoScroll?: boolean;
	dragActivationDistance?: number;
	allowDrawingArrows?: boolean;
	arrows?: Arrow[];
	arrowOptions?: ArrowOptions;
	clearArrowsOnClick?: boolean;
	clearArrowsOnPositionChange?: boolean;
	canDragPiece?: (args: PieceHandlerArgs) => boolean;
	onArrowsChange?: (args: { arrows: Arrow[] }) => void;
	onMouseOutSquare?: (args: SquareHandlerArgs) => void;
	onMouseOverSquare?: (args: SquareHandlerArgs) => void;
	onPieceClick?: (args: PieceHandlerArgs) => void;
	onPieceDrag?: (args: PieceHandlerArgs) => void;
	onPieceDragCancel?: () => void;
	onPieceDrop?: (args: PieceDropHandlerArgs) => boolean;
	onSquareClick?: (args: SquareHandlerArgs) => void;
	onSquareMouseDown?: (args: SquareHandlerArgs, event: MouseEvent) => void;
	onSquareMouseUp?: (args: SquareHandlerArgs, event: MouseEvent) => void;
	onSquareRightClick?: (args: SquareHandlerArgs) => void;
	squareRenderer?: SquareRenderer;
}