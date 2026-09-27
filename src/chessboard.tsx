import { type Handle } from 'remix/ui';
import { ArrowLayer } from './arrow_layer.tsx';
import { Board } from './board.tsx';
import type { ChessboardOptions } from './board_options.ts';
import { createBoardStore } from './board_store.ts';
import { defaultBoardRootStyle } from './defaults.ts';
import { resolveBoardOptions } from './resolved_options.ts';

export interface ChessboardComponentProps {
	options?: ChessboardOptions;
}

export function Chessboard(handle: Handle<ChessboardComponentProps>) {
	const store = createBoardStore(resolveBoardOptions(handle.props.options ?? {}), () => {
		void handle.update();
	});
	if (typeof window !== 'undefined') {
		handle.signal.addEventListener('abort', () => {
			store.destroy();
		});
	}
	return () => {
		store.options = resolveBoardOptions(handle.props.options ?? {});
		if (typeof document !== 'undefined') {
			handle.queueTask(() => {
				store.syncDimensions();
				store.syncPosition(store.options.position);
			});
		}
		const state = store.state;
		return <div style={defaultBoardRootStyle}>
			<Board store={store} state={state} />
			<ArrowLayer store={store} state={state} />
		</div>;
	};
}