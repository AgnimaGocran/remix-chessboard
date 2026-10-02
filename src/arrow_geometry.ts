import type { Arrow, ArrowOptions } from './arrow.ts';
import { getRelativeCoords } from './position_utils.ts';

export interface ArrowGeometry {
	/// Контур всей стрелки одним путём: круглый хвостовой торец, ствол и
	/// треугольник-наконечник. Одна заливка — ствол нигде не лежит под
	/// наконечником, поэтому не просвечивает при полупрозрачном цвете.
	path: string;
	opacity: number;
}

/// Геометрия повторяет chessground (доска lichess.org, src/svg.ts) построчно,
/// в долях клетки:
///   - ствол шириной lineWidth/64 (lineWidth 10 — обычная кисть),
///     от центра до центра клеток, скруглённый торец;
///   - конец ствола не доходит до центра цели margin (10/64; 20/64,
///     если в клетку ведёт несколько стрелок);
///   - наконечник — треугольник длиной 3 и основанием 4 ширины ствола,
///     якорь на 2.05 ширины от основания — кончик доходит до центра
///     целевой клетки;
///   - рисуемая (активная) стрелка: ширина ×0.85, прозрачность ×0.9.
const LINE_WIDTH = 10 / 64;
const MARGIN = 10 / 64;
const SHORTENED_MARGIN = 20 / 64;
const HEAD_LENGTH = 3;
const HEAD_BASE = 4;
const HEAD_REF = 2.05;
const ACTIVE_WIDTH = 0.85;
const ACTIVE_OPACITY = 0.9;

export function arrowGeometry(
	arrow: Arrow,
	arrowsToDraw: Arrow[],
	arrowOptions: ArrowOptions,
	boardOrientation: 'white' | 'black',
	chessboardColumns: number,
	chessboardRows: number,
	isActive: boolean,
	viewBoxWidth: number,
): ArrowGeometry {
	const from = getRelativeCoords(
		boardOrientation,
		viewBoxWidth,
		chessboardColumns,
		chessboardRows,
		arrow.startSquare,
	);
	const to = getRelativeCoords(
		boardOrientation,
		viewBoxWidth,
		chessboardColumns,
		chessboardRows,
		arrow.endSquare,
	);
	const squareWidth = viewBoxWidth / chessboardColumns;
	const hasOtherArrowToSameTarget = arrowsToDraw.some(
		(other) =>
			other.startSquare !== arrow.startSquare && other.endSquare === arrow.endSquare,
	);
	const shorten = hasOtherArrowToSameTarget && !isActive;
	const margin = (shorten ? SHORTENED_MARGIN : MARGIN) * squareWidth;
	const dx = to.x - from.x;
	const dy = to.y - from.y;
	const r = Math.hypot(dy, dx);
	const ux = dx / r;
	const uy = dy / r;
	const nx = -uy;
	const ny = ux;
	const width =
		LINE_WIDTH *
		squareWidth *
		(arrow.widthFactor ?? 1) *
		(isActive ? ACTIVE_WIDTH : 1);
	const lineEnd = {
		x: to.x - ux * margin,
		y: to.y - uy * margin,
	};
	const halfBase = (HEAD_BASE / 2) * width;
	const baseCenter = {
		x: lineEnd.x - ux * HEAD_REF * width,
		y: lineEnd.y - uy * HEAD_REF * width,
	};
	const tip = {
		x: lineEnd.x + ux * (HEAD_LENGTH - HEAD_REF) * width,
		y: lineEnd.y + uy * (HEAD_LENGTH - HEAD_REF) * width,
	};
	const halfShaft = width / 2;
	const tailLeft = { x: from.x + nx * halfShaft, y: from.y + ny * halfShaft };
	const tailRight = { x: from.x - nx * halfShaft, y: from.y - ny * halfShaft };
	const shaftLeft = {
		x: baseCenter.x + nx * halfShaft,
		y: baseCenter.y + ny * halfShaft,
	};
	const shaftRight = {
		x: baseCenter.x - nx * halfShaft,
		y: baseCenter.y - ny * halfShaft,
	};
	const path = [
		`M${tailLeft.x},${tailLeft.y}`,
		`L${shaftLeft.x},${shaftLeft.y}`,
		`L${baseCenter.x + nx * halfBase},${baseCenter.y + ny * halfBase}`,
		`L${tip.x},${tip.y}`,
		`L${baseCenter.x - nx * halfBase},${baseCenter.y - ny * halfBase}`,
		`L${shaftRight.x},${shaftRight.y}`,
		`L${tailRight.x},${tailRight.y}`,
		`A${halfShaft} ${halfShaft} 0 0 0 ${tailLeft.x},${tailLeft.y}`,
		'Z',
	].join(' ');
	return {
		path,
		opacity: arrowOptions.opacity * (isActive ? ACTIVE_OPACITY : 1),
	};
}
