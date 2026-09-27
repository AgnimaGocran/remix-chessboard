import type { Handle } from 'remix/ui';
import {
	defaultAlphaNotationStyle,
	defaultDarkSquareNotationStyle,
	defaultLightSquareNotationStyle,
	defaultNumericNotationStyle,
} from './defaults.ts';
import type { ResolvedBoardOptions } from './resolved_options.ts';

export interface BoardNotationProps {
	options: ResolvedBoardOptions;
	column: string;
	row: string;
	isLightSquare: boolean;
	columnIndex: number;
}

export function BoardNotation(handle: Handle<BoardNotationProps>) {
	return () => {
		const { options, column, row, isLightSquare } = handle.props;
		const isLastRow =
			row ===
			(options.boardOrientation === 'white'
				? '1'
				: options.chessboardRows.toString());
		const isRightColumn =
			column ===
			(options.boardOrientation === 'white'
				? String.fromCharCode(97 + options.chessboardColumns - 1)
				: 'a');
		return <span
			style={
				isLightSquare
					? { ...defaultLightSquareNotationStyle, ...options.lightSquareNotationStyle }
					: { ...defaultDarkSquareNotationStyle, ...options.darkSquareNotationStyle }
			}
		>
			{isLastRow ? (
				<span style={{ ...defaultAlphaNotationStyle, ...options.alphaNotationStyle }}>
					{column}
				</span>
			) : null}
			{isRightColumn ? (
				<span style={{ ...defaultNumericNotationStyle, ...options.numericNotationStyle }}>
					{row}
				</span>
			) : null}
		</span>;
	};
}