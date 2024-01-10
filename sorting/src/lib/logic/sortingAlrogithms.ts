import type { SortingAnimation } from '$lib/interfaces/animation';

function mergeSort(
	array: number[],
	startIndex: number,
	endIndex: number,
	animations: SortingAnimation[],
	referenceArray: number[]
) {
	// When we come to the point of the array having just a single item, we stop
	// Until then, we continue splitting it in halves
	if (startIndex == endIndex) {
		return;
	}

	// We look for the center of the array to split it into halves
	const middleIndex = Math.floor((endIndex + startIndex) / 2);

	mergeSort(referenceArray, startIndex, middleIndex, animations, array);
	mergeSort(referenceArray, middleIndex + 1, endIndex, animations, array);

	merge(array, startIndex, middleIndex, endIndex, referenceArray, animations);
}

function merge(
	array: number[],
	startIndex: number,
	middleIndex: number,
	endIndex: number,
	referenceArray: number[],
	animations: SortingAnimation[]
) {
	animations.push({ type: 'ARRAY', first: startIndex, second: endIndex });

	// pointers to the starts of both halves
	let i = startIndex;
	let j = middleIndex + 1;

	// pointer to the section of the original array where new elements should be put
	let k = startIndex;

	while (i <= middleIndex && j <= endIndex) {
		animations.push({ type: 'COMPARE', first: i, second: j });
		if (referenceArray[i] <= referenceArray[j]) {
			animations.push({ type: 'PICK_MIN', first: k, second: i });
			array[k++] = referenceArray[i++];
		} else {
			animations.push({ type: 'PICK_MIN', first: k, second: j });
			array[k++] = referenceArray[j++];
		}
	}

	while (i <= middleIndex) {
		animations.push({ type: 'COMPARE', first: i, second: -1 });
		animations.push({ type: 'PICK_MIN', first: k, second: i });
		array[k++] = referenceArray[i++];
	}

	while (j <= endIndex) {
		animations.push({ type: 'COMPARE', first: j, second: -1 });
		animations.push({ type: 'PICK_MIN', first: k, second: j });
		array[k++] = referenceArray[j++];
	}
}

export { mergeSort };
