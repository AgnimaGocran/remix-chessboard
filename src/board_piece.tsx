import { type Handle, on, ref } from 'remix/ui';
import type { BoardState } from './board_state.ts';
import type { BoardStore } from './board_store.ts';
import type { BoardStyle } from './board_style.ts';

export interface BoardPieceProps {
	store: BoardStore;
	state: BoardState;
	position: string;
	pieceType: string;
	isSparePiece: boolean;
	clone?: boolean;
}

export function BoardPiece(handle: Handle<BoardPieceProps>) {
	return () => {
		const { store, state, position, pieceType, isSparePiece, clone = false } = handle.props;
		const { options } = store;
		const difference =
			!clone && !isSparePiece ? (state.positionDifferences[position] ?? null) : null;
		const draggable =
			!isSparePiece && !clone && store.canDrag({ isSparePiece, position, pieceType });
		const renderPiece = options.pieces[pieceType];
		return <div
			id={`${options.id}-piece-${pieceType}-${position}`}
			data-piece={pieceType}
			draggable={false}
			style={{
				...animationStyle(store, position, difference),
				width: '100%',
				height: '100%',
				cursor: draggable ? 'grab' : 'pointer',
				touchAction: 'none',
			}}
			mix={[
				ref((node, signal) => {
					if (!clone && node instanceof HTMLElement) {
						store.attachPiece(position, node, signal);
					}
				}),
				on('click', () => {
					options.onPieceClick?.({
						isSparePiece,
						piece: { pieceType },
						square: position,
					});
				}),
			]}
		>
			{renderPiece !== undefined ? renderPiece({ square: position }) : null}
		</div>;
	};
}

function animationStyle(
	store: BoardStore,
	position: string,
	targetSquare: string | null,
): BoardStyle {
	if (targetSquare === null || typeof document === 'undefined') {
		return {};
	}
	const squareElement = document.getElementById(
		`${store.options.id}-square-${position}`,
	);
	if (squareElement === null) {
		return {};
	}
	const squareWidth = squareElement.getBoundingClientRect().width;
	if (squareWidth === 0) {
		return {};
	}
	const factor = store.options.boardOrientation === 'black' ? -1 : 1;
	const dx =
		(targetSquare.charCodeAt(0) - position.charCodeAt(0)) * squareWidth * factor;
	const dy = (Number(position[1]) - Number(targetSquare[1])) * squareWidth * factor;
	return {
		transform: `translate(${dx}px, ${dy}px)`,
		transition: `transform ${store.options.animationDurationInMs}ms`,
		position: 'relative',
		zIndex: 10,
	};
}