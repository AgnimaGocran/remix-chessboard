import type { Handle } from 'remix/ui';
import { BoardPiece } from './board_piece.tsx';
import type { BoardState } from './board_state.ts';
import type { BoardStore } from './board_store.ts';

export interface SparePieceProps {
	store: BoardStore;
	state: BoardState;
	pieceType: string;
}

export function SparePiece(handle: Handle<SparePieceProps>) {
	return () => {
		const { store, state, pieceType } = handle.props;
		return <BoardPiece
			store={store}
			state={state}
			position={pieceType}
			pieceType={pieceType}
			isSparePiece={true}
		/>;
	};
}