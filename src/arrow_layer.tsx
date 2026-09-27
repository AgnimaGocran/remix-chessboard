import type { Handle } from 'remix/ui';
import type { Arrow } from './arrow.ts';
import { ArrowPath } from './arrow_path.tsx';
import type { BoardState } from './board_state.ts';
import type { BoardStore } from './board_store.ts';
import { defaultArrowLayerStyle } from './defaults.ts';

export interface ArrowLayerProps {
	store: BoardStore;
	state: BoardState;
}

export function ArrowLayer(handle: Handle<ArrowLayerProps>) {
	return () => {
		const { store, state } = handle.props;
		const { options } = store;
		const viewBoxWidth = 2048;
		const viewBoxHeight = viewBoxWidth * (options.chessboardRows / options.chessboardColumns);
		const preview: Arrow | null =
			state.arrowStartSquare !== null &&
			state.arrowOver !== null &&
			state.arrowStartSquare !== state.arrowOver.square
				? {
						startSquare: state.arrowStartSquare,
						endSquare: state.arrowOver.square,
						color: state.arrowOver.color,
					}
				: null;
		const arrowsToDraw =
			preview !== null
				? [...options.arrows, ...state.arrows, preview]
				: [...options.arrows, ...state.arrows];
		return <svg
			viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
			style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, ...defaultArrowLayerStyle }}
		>
		{arrowsToDraw.map((arrow, index) => <ArrowPath
			key={`${arrow.startSquare}-${arrow.endSquare}-${index}`}
			arrow={arrow}
			arrowsToDraw={arrowsToDraw}
			options={options.arrowOptions}
			boardOrientation={options.boardOrientation}
			chessboardColumns={options.chessboardColumns}
			chessboardRows={options.chessboardRows}
			isActive={preview !== null && index === arrowsToDraw.length - 1}
			viewBoxWidth={viewBoxWidth}
		/>)}
		</svg>;
	};
}