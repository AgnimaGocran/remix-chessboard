// Сгенерировано из react-chessboard (реестр фигур)

import { blackBishopPiece } from './pieces/black_bishop.tsx';
import { blackKingPiece } from './pieces/black_king.tsx';
import { blackKnightPiece } from './pieces/black_knight.tsx';
import { blackPawnPiece } from './pieces/black_pawn.tsx';
import { blackQueenPiece } from './pieces/black_queen.tsx';
import { blackRookPiece } from './pieces/black_rook.tsx';
import { whiteBishopPiece } from './pieces/white_bishop.tsx';
import { whiteKingPiece } from './pieces/white_king.tsx';
import { whiteKnightPiece } from './pieces/white_knight.tsx';
import { whitePawnPiece } from './pieces/white_pawn.tsx';
import { whiteQueenPiece } from './pieces/white_queen.tsx';
import { whiteRookPiece } from './pieces/white_rook.tsx';
import type { PieceRenderObject } from './renderer_types.ts';

export const defaultPieces: PieceRenderObject = {
	wP: whitePawnPiece,
	wR: whiteRookPiece,
	wN: whiteKnightPiece,
	wB: whiteBishopPiece,
	wQ: whiteQueenPiece,
	wK: whiteKingPiece,
	bP: blackPawnPiece,
	bR: blackRookPiece,
	bN: blackKnightPiece,
	bB: blackBishopPiece,
	bQ: blackQueenPiece,
	bK: blackKingPiece,
};