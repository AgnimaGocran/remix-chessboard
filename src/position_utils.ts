import type { FenPieceString, PositionDataType } from './position_data.ts';
import type { SquareDataType } from './square_data.ts';

export function generateBoard(
	noOfRows: number,
	noOfColumns: number,
	boardOrientation: 'white' | 'black',
): SquareDataType[][] {
	const board: SquareDataType[][] = Array.from(Array(noOfRows), () =>
		new Array<SquareDataType>(noOfColumns),
	);
	for (let row = 0; row < noOfRows; row++) {
		for (let column = 0; column < noOfColumns; column++) {
			board[row][column] = {
				squareId: `${columnIndexToChessColumn(column, noOfColumns, boardOrientation)}${rowIndexToChessRow(row, noOfRows, boardOrientation)}`,
				isLightSquare: (row + column) % 2 === 0,
			};
		}
	}
	return board;
}

export function rowIndexToChessRow(
	row: number,
	noOfRows: number,
	boardOrientation: 'white' | 'black',
): string {
	return boardOrientation === 'white'
		? (noOfRows - row).toString()
		: (row + 1).toString();
}

export function columnIndexToChessColumn(
	column: number,
	noOfColumns: number,
	boardOrientation: 'white' | 'black',
): string {
	return boardOrientation === 'white'
		? String.fromCharCode(97 + column)
		: String.fromCharCode(97 + noOfColumns - column - 1);
}

export function chessColumnToColumnIndex(
	column: string,
	noOfColumns: number,
	boardOrientation: 'white' | 'black',
): number {
	return boardOrientation === 'white'
		? column.charCodeAt(0) - 97
		: noOfColumns - (column.charCodeAt(0) - 97) - 1;
}

export function chessRowToRowIndex(
	row: string,
	noOfRows: number,
	boardOrientation: 'white' | 'black',
): number {
	return boardOrientation === 'white'
		? noOfRows - Number(row)
		: Number(row) - 1;
}

export function fenStringToPositionObject(
	fen: string,
	noOfRows: number,
	noOfColumns: number,
): PositionDataType {
	const positionObject: PositionDataType = {};
	const fenRows = fen.split(' ')[0].split('/');
	for (let row = 0; row < fenRows.length; row++) {
		let column = 0;
		for (const char of fenRows[row]) {
			if (Number.isNaN(Number(char))) {
				const position = `${columnIndexToChessColumn(column, noOfColumns, 'white')}${rowIndexToChessRow(row, noOfRows, 'white')}`;
				positionObject[position] = {
					pieceType: fenToPieceCode(char as FenPieceString),
				};
				column++;
			} else {
				column += Number(char);
			}
		}
	}
	return positionObject;
}

function fenToPieceCode(piece: FenPieceString): string {
	if (piece.toLowerCase() === piece) {
		return `b${piece.toUpperCase()}`;
	}
	return `w${piece.toUpperCase()}`;
}

export function splitSquare(square: string): { column: string; row: string } {
	return {
		column: square.match(/^[a-z]+/)?.[0] ?? '',
		row: square.match(/\d+$/)?.[0] ?? '',
	};
}

export function getRelativeCoords(
	boardOrientation: 'white' | 'black',
	boardWidth: number,
	chessboardColumns: number,
	chessboardRows: number,
	square: string,
): { x: number; y: number } {
	const squareWidth = boardWidth / chessboardColumns;
	const { column, row } = splitSquare(square);
	const x =
		chessColumnToColumnIndex(column, chessboardColumns, boardOrientation) *
			squareWidth +
		squareWidth / 2;
	const y =
		chessRowToRowIndex(row, chessboardRows, boardOrientation) * squareWidth +
		squareWidth / 2;
	return { x, y };
}