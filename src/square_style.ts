import type { BoardStyle } from './board_style.ts';
import {
	defaultDarkSquareStyle,
	defaultDropSquareStyle,
	defaultLightSquareStyle,
	defaultSquareStyle,
} from './defaults.ts';
import type { ResolvedBoardOptions } from './resolved_options.ts';

export function squareStyleFor(
	options: ResolvedBoardOptions,
	isLightSquare: boolean,
	isOver: boolean,
): BoardStyle {
	return {
		...defaultSquareStyle,
		...options.squareStyle,
		...(isLightSquare
			? { ...defaultLightSquareStyle, ...options.lightSquareStyle }
			: { ...defaultDarkSquareStyle, ...options.darkSquareStyle }),
		...(isOver ? { ...defaultDropSquareStyle, ...options.dropSquareStyle } : {}),
	};
}