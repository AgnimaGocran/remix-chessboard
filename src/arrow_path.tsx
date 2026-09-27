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
		/// Ствол и наконечник в одной группе с общей прозрачностью:
		/// основание треугольника смыкается с торцом ствола,
		/// наложения (и «квадрат» внутри наконечника) нет.
		return <g opacity={geometry.opacity}>
			<path
				d={geometry.path}
				fill="none"
				stroke={arrow.color}
				strokeWidth={geometry.width}
				strokeLinecap="round"
			/>
			<polygon points={geometry.headPoints} fill={arrow.color} />
		</g>;
	};
}
