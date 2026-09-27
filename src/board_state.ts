import type { Arrow, DrawingArrow } from './arrow.ts';
import type { DraggingPieceDataType } from './piece_data.ts';
import type { PositionDataType } from './position_data.ts';
import type { SquareDataType } from './square_data.ts';

export interface BoardState {
	board: SquareDataType[][];
	position: PositionDataType;
	positionDifferences: Record<string, string>;
	dragging: DraggingPieceDataType | null;
	overSquare: string | null;
	arrows: Arrow[];
	arrowStartSquare: string | null;
	arrowOver: DrawingArrow | null;
}

export function createBoardState(board: SquareDataType[][]): BoardState {
	return {
		board,
		position: {},
		positionDifferences: {},
		dragging: null,
		overSquare: null,
		arrows: [],
		arrowStartSquare: null,
		arrowOver: null,
	};
}