export type FenPieceString =
	| 'p'
	| 'r'
	| 'n'
	| 'b'
	| 'q'
	| 'k'
	| 'P'
	| 'R'
	| 'N'
	| 'B'
	| 'Q'
	| 'K';

export interface PieceOnSquare {
	pieceType: string;
}

export interface PositionDataType {
	[square: string]: PieceOnSquare;
}