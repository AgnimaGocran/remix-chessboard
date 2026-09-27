import type { RemixNode } from 'remix/ui';
import type { PieceOnSquare } from './position_data.ts';

export interface PieceSvgProps {
	fill?: string;
	square?: string;
	svgStyle?: Record<string, string>;
}

export interface SquareRendererProps {
	piece: PieceOnSquare | null;
	square: string;
	children?: RemixNode;
}

export type SquareRenderer = (props: SquareRendererProps) => RemixNode;

export type PieceRenderObject = Record<string, (props: PieceSvgProps) => RemixNode>;