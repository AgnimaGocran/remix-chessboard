export interface Arrow {
	startSquare: string;
	endSquare: string;
	color: string;
	/// Множитель толщины конкретной стрелки (1 — стандартная толщина).
	widthFactor?: number;
}

export interface ArrowColors {
	default: string;
	shift: string;
	ctrl: string;
	alt: string;
	meta: string;
}

export interface ArrowModifiers {
	shiftKey: boolean;
	ctrlKey: boolean;
	altKey: boolean;
	metaKey: boolean;
}

export interface ArrowOptions {
	colors: ArrowColors;
	color: string;
	secondaryColor: string;
	tertiaryColor: string;
	/// Прозрачность всей стрелки; рисуемая юзером — ×0.9, как на lichess.
	opacity: number;
}

export interface DrawingArrow {
	square: string;
	color: string;
}