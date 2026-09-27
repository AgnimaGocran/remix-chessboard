import { type Handle, on, ref } from 'remix/ui';
import type { ArrowModifiers } from './arrow.ts';
import { BoardNotation } from './board_notation.tsx';
import { BoardPiece } from './board_piece.tsx';
import type { BoardState } from './board_state.ts';
import type { BoardStore } from './board_store.ts';
import { splitSquare } from './position_utils.ts';
import type { SquareDataType } from './square_data.ts';
import { squareStyleFor } from './square_style.ts';

export interface BoardSquareProps {
	store: BoardStore;
	state: BoardState;
	square: SquareDataType;
}

export function BoardSquare(handle: Handle<BoardSquareProps>) {
	let isDrawingArrow = false;
	return () => {
		const { store, state, square } = handle.props;
		const { options } = store;
		const { squareId, isLightSquare } = square;
		const piece = state.position[squareId] ?? null;
		const { column, row } = splitSquare(squareId);

		function modifiersOf(event: MouseEvent): ArrowModifiers {
			return {
				shiftKey: event.shiftKey,
				ctrlKey: event.ctrlKey,
				altKey: event.altKey,
				metaKey: event.metaKey,
			};
		}

		const content = <div
			style={{ width: '100%', height: '100%', ...options.squareStyles[squareId] }}
		>
			{piece !== null ? <BoardPiece
				store={store}
				state={state}
				position={squareId}
				pieceType={piece.pieceType}
				isSparePiece={false}
			/> : null}
		</div>;

		return <div
			id={`${options.id}-square-${squareId}`}
			data-square={squareId}
			data-column={column}
			data-row={row}
			style={squareStyleFor(options, isLightSquare, state.overSquare === squareId)}
			mix={[
				ref((node, signal) => {
					if (node instanceof HTMLElement) {
						store.attachSquare(squareId, node, signal);
					}
				}),
				on('click', () => {
					options.onSquareClick?.({ piece, square: squareId });
				}),
				on('contextmenu', (event) => {
					event.preventDefault();
					if (!isDrawingArrow) {
						options.onSquareRightClick?.({ piece, square: squareId });
					}
					isDrawingArrow = false;
				}),
				on('mousedown', (event) => {
					if (event.button === 0) {
						store.clearArrows();
					}
					if (event.button === 2 && options.allowDrawingArrows) {
						store.startArrow(squareId);
					}
					options.onSquareMouseDown?.({ piece, square: squareId }, event);
				}),
				on('mouseup', (event) => {
					if (event.button === 2) {
						if (
							options.allowDrawingArrows &&
							state.arrowStartSquare !== null &&
							state.arrowStartSquare !== squareId
						) {
							isDrawingArrow = true;
							store.finishArrow(squareId, modifiersOf(event));
						} else if (state.arrowStartSquare === squareId) {
							store.cancelArrow();
						}
					}
					options.onSquareMouseUp?.({ piece, square: squareId }, event);
				}),
				on('mouseover', (event) => {
					if (
						event.buttons === 2 &&
						options.allowDrawingArrows &&
						state.arrowStartSquare !== null &&
						state.arrowStartSquare !== squareId
					) {
						store.setArrowOver(squareId, modifiersOf(event));
					} else if (state.arrowStartSquare === squareId) {
						store.setArrowOver(null, modifiersOf(event));
					}
					if (state.dragging === null) {
						options.onMouseOverSquare?.({ piece, square: squareId });
					}
				}),
				on('mouseleave', () => {
					if (state.dragging === null) {
						options.onMouseOutSquare?.({ piece, square: squareId });
					}
				}),
			]}
		>
			{options.showNotation ? <BoardNotation
				options={options}
				column={column}
				row={row}
				isLightSquare={isLightSquare}
				columnIndex={column.charCodeAt(0) - 97}
			/> : null}
			{options.squareRenderer !== null
				? options.squareRenderer({ piece, square: squareId, children: content })
				: content}
		</div>;
	};
}