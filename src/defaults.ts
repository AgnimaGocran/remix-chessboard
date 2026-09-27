import type { ArrowOptions } from './arrow.ts';
import type { BoardStyle, NamedStyles } from './board_style.ts';

export function defaultBoardStyle(chessboardColumns: number): BoardStyle {
	return {
		display: 'grid',
		gridTemplateColumns: `repeat(${chessboardColumns}, 1fr)`,
		overflow: 'hidden',
		width: '100%',
		height: '100%',
		position: 'relative',
	};
}

export const defaultSquareStyle: BoardStyle = {
	aspectRatio: '1/1',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	position: 'relative',
};

export const defaultDarkSquareStyle: BoardStyle = { backgroundColor: '#B58863' };
export const defaultLightSquareStyle: BoardStyle = { backgroundColor: '#F0D9B5' };
export const defaultDropSquareStyle: BoardStyle = {
	boxShadow: 'inset 0px 0px 0px 1px black',
};
export const defaultDarkSquareNotationStyle: BoardStyle = { color: '#F0D9B5' };
export const defaultLightSquareNotationStyle: BoardStyle = { color: '#B58863' };
export const defaultAlphaNotationStyle: BoardStyle = {
	fontSize: '13px',
	position: 'absolute',
	bottom: 1,
	left: 4,
	userSelect: 'none',
};
export const defaultNumericNotationStyle: BoardStyle = {
	fontSize: '13px',
	position: 'absolute',
	top: 2,
	right: 2,
	userSelect: 'none',
};
export const defaultBoardRootStyle: BoardStyle = {
	position: 'relative',
	width: '100%',
	userSelect: 'none',
	WebkitUserSelect: 'none',
};
export const defaultArrowLayerStyle: BoardStyle = { pointerEvents: 'none', zIndex: 20 };
export const defaultDragLayerStyle: BoardStyle = {
	position: 'fixed',
	top: 0,
	left: 0,
	pointerEvents: 'none',
	zIndex: 30,
};

export const defaultArrowOptions: ArrowOptions = {
	colors: {
		default: '#ffaa00',
		shift: '#4caf50',
		ctrl: '#f44336',
		alt: '#9c27b0',
		meta: '#fbbf24',
	},
	color: '#ffaa00',
	secondaryColor: '#4caf50',
	tertiaryColor: '#f44336',
	/// Сплошные стрелки, как у обычных кистей lichess.
	opacity: 1,
};

export const defaultSquareStyles: NamedStyles = {};