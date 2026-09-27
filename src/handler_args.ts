import type { DraggingPieceDataType, PieceDataType } from './piece_data.ts';

export interface SquareHandlerArgs {
	piece: PieceDataType | null;
	square: string;
}

export interface PieceHandlerArgs {
	isSparePiece: boolean;
	piece: PieceDataType;
	square: string | null;
}

export interface PieceDropHandlerArgs {
	piece: DraggingPieceDataType;
	sourceSquare: string;
	targetSquare: string | null;
}