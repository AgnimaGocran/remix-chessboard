import type { PositionDataType } from './position_data.ts';
import {
	chessColumnToColumnIndex,
	chessRowToRowIndex,
	splitSquare,
} from './position_utils.ts';

export function getPromotionUpdates(
	oldPosition: PositionDataType,
	newPosition: PositionDataType,
	noOfRows: number,
	noOfColumns: number,
): Record<string, string> {
	const updates: Record<string, string> = {};
	for (const newSquare in newPosition) {
		if (oldPosition[newSquare]?.pieceType === newPosition[newSquare].pieceType) {
			continue;
		}
		for (const oldSquare in oldPosition) {
			if (newPosition[oldSquare]?.pieceType === oldPosition[oldSquare].pieceType) {
				continue;
			}
			if (
				pawnPromotesAtSquares(
					oldPosition,
					newPosition,
					oldSquare,
					newSquare,
					noOfRows,
					noOfColumns,
				)
			) {
				updates[oldSquare] = newSquare;
			}
		}
	}
	return updates;
}

function pawnPromotesAtSquares(
	oldPosition: PositionDataType,
	newPosition: PositionDataType,
	oldSquare: string,
	newSquare: string,
	noOfRows: number,
	noOfColumns: number,
): boolean {
	const oldPiece = oldPosition[oldSquare].pieceType;
	const newPiece = newPosition[newSquare].pieceType;
	const promotable = new Set(['Q', 'R', 'B', 'N']);
	let pawnSquare: string;
	let promotionSquare: string;
	if (oldPiece[1] === 'P' && promotable.has(newPiece[1])) {
		pawnSquare = oldSquare;
		promotionSquare = newSquare;
	} else if (newPiece[1] === 'P' && promotable.has(oldPiece[1])) {
		pawnSquare = newSquare;
		promotionSquare = oldSquare;
	} else {
		return false;
	}
	const pawn = splitSquare(pawnSquare);
	const promotion = splitSquare(promotionSquare);
	const columnDifference = Math.abs(
		chessColumnToColumnIndex(pawn.column, noOfColumns, 'black') -
			chessColumnToColumnIndex(promotion.column, noOfColumns, 'black'),
	);
	if (columnDifference > 1 || oldPiece[0] !== newPiece[0]) {
		return false;
	}
	const pawnRow = chessRowToRowIndex(pawn.row, noOfRows, 'black');
	const promotionRow = chessRowToRowIndex(promotion.row, noOfRows, 'black');
	if (oldPiece[0] === 'b' && pawnRow === 1 && promotionRow === 0) {
		return true;
	}
	if (oldPiece[0] === 'w' && pawnRow === noOfRows - 2 && promotionRow === noOfRows - 1) {
		return true;
	}
	return false;
}