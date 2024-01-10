import type { SortingAnimation } from '$lib/interfaces/animation';
import { mergeSort } from '../logic/sortingAlrogithms';
import {
	MAX_ANIMATION_SPEED,
	MAX_ARRAY_VALUE,
	MIN_ANIMATION_SPEED,
	MIN_ARRAY_VALUE
} from './consts';

function getSortAnimations(array: number[]): [number[], SortingAnimation[]] {
	const animations: SortingAnimation[] = [];

	const referenceArray = array.slice();

	mergeSort(array, 0, array.length - 1, animations, referenceArray);

	return [array, animations];
}

function calculateAnimationSpeed(input: number) {
	return MAX_ANIMATION_SPEED - input + MIN_ANIMATION_SPEED;
}

function generateArray(arrayLength: number) {
	return Array.from(Array(arrayLength).keys(), (_) =>
		Math.floor(Math.random() * (MAX_ARRAY_VALUE - MIN_ARRAY_VALUE) + MIN_ARRAY_VALUE)
	);
}

export { calculateAnimationSpeed, generateArray, getSortAnimations };
