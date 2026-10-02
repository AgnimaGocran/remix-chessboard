import type { Handle } from 'remix/ui';
import type { Arrow, ArrowOptions } from './arrow.ts';
import { arrowGeometry } from './arrow_geometry.ts';

export interface ArrowPathProps {
	arrow: Arrow;
	arrowsToDraw: Arrow[];
	options: ArrowOptions;
	boardOrientation: 'white' | 'black';
	chessboardColumns: number;
	chessboardRows: number;
	isActive: boolean;
	viewBoxWidth: number;
}

export function ArrowPath(handle: Handle<ArrowPathProps>) {
	return () => {
		const props = handle.props;
		const { arrow, arrowsToDraw, options } = props;
		const geometry = arrowGeometry(
			arrow,
			arrowsToDraw,
			options,
			props.boardOrientation,
			props.chessboardColumns,
			props.chessboardRows,
			props.isActive,
			props.viewBoxWidth,
		);
		/// Один залитый контур: ствол не накладывается на наконечник,
		/// поэтому при полупрозрачном цвете внутри наконечника ничего
		/// не просвечивает.
		return <g opacity={geometry.opacity}>
			<path d={geometry.path} fill={arrow.color} />
		</g>;
	};
}
