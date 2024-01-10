export interface SortingAnimation {
	type: AnimationType;
	first: number;
	second: number;
}

export type AnimationType = 'COMPARE' | 'PICK_MIN' | 'ARRAY';
