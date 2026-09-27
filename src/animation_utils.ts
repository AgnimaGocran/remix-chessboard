import type { PositionDataType } from './position_data.ts';
import {
	chessColumnToColumnIndex,
	splitSquare,
} from './position_utils.ts';

export function getPositionUpdates(
	oldPosition: PositionDataType,
	newPosition: PositionDataType,
	noOfColumns: number,
	boardOrientation: 'white' | 'black',
): Record<string, string> {
	const updates: Record<string, string> = {};
	for (const newSquare in newPosition) {
		const candidates: string[] = [];
		if (oldPosition[newSquare]?.pieceType === newPosition[newSquare].pieceType) {
			continue;
		}
		for (const oldSquare in oldPosition) {
			if (
				oldPosition[oldSquare].pieceType === newPosition[newSquare].pieceType &&
				oldSquare !== newSquare &&
				oldPosition[oldSquare].pieceType !== newPosition[oldSquare]?.pieceType
			) {
				candidates.push(oldSquare);
			}
		}
		if (candidates.length === 1) {
			updates[candidates[0]] = newSquare;
			continue;
		}
		for (const candidate of candidates) {
			if (matchesMove(candidate, newSquare, oldPosition, noOfColumns, boardOrientation)) {
				updates[candidate] = newSquare;
				break;
			}
		}
		if (!Object.values(updates).includes(newSquare) && candidates.length > 0) {
			for (const candidate of candidates) {
				if (!Object.keys(updates).includes(candidate)) {
					updates[candidate] = newSquare;
					break;
				}
			}
		}
	}
	return updates;
}

function matchesMove(
	candidate: string,
	newSquare: string,
	oldPosition: PositionDataType,
	noOfColumns: number,
	boardOrientation: 'white' | 'black',
): boolean {
	const candidatePieceType = oldPosition[candidate].pieceType[1];
	const from = splitSquare(candidate);
	const to = splitSquare(newSquare);
	const columnDifference = Math.abs(
		chessColumnToColumnIndex(from.column, noOfColumns, boardOrientation) -
			chessColumnToColumnIndex(to.column, noOfColumns, boardOrientation),
	);
	const rowDifference = Math.abs(Number(from.row) - Number(to.row));
	const isOldSquareLight =
		(chessColumnToColumnIndex(from.column, noOfColumns, boardOrientation) +
			Number(from.row)) %
			2 ===
		0;
	const isNewSquareLight =
		(chessColumnToColumnIndex(to.column, noOfColumns, boardOrientation) +
			Number(to.row)) %
			2 ===
		0;
	if (candidatePieceType === 'P') {
		return from.column === to.column;
	}
	if (candidatePieceType === 'N') {
		return (
			(columnDifference === 2 && rowDifference === 1) ||
			(columnDifference === 1 && rowDifference === 2)
		);
	}
	if (candidatePieceType === 'B') {
		return columnDifference === rowDifference && isOldSquareLight === isNewSquareLight;
	}
	if (candidatePieceType === 'R') {
		return columnDifference === 0 || rowDifference === 0;
	}
	if (candidatePieceType === 'Q') {
		return (
			columnDifference === 0 ||
			rowDifference === 0 ||
			columnDifference === rowDifference
		);
	}
	if (candidatePieceType === 'K') {
		return columnDifference <= 1 && rowDifference <= 1;
	}
	return false;
}