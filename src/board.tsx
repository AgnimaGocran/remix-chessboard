import type { Handle } from 'remix/ui';
import { BoardSquare } from './board_square.tsx';
import type { BoardState } from './board_state.ts';
import type { BoardStore } from './board_store.ts';
import { defaultBoardStyle } from './defaults.ts';

export interface BoardProps {
	store: BoardStore;
	state: BoardState;
}

export function Board(handle: Handle<BoardProps>) {
	return () => {
		const { store, state } = handle.props;
		const { options } = store;
		return <div
			id={`${options.id}-board`}
			style={{ ...defaultBoardStyle(options.chessboardColumns), ...options.boardStyle }}
		>
			{state.board.map((row) => row.map((square) => <BoardSquare
				key={square.squareId}
				store={store}
				state={state}
				square={square}
			/>))}
		</div>;
	};
}