<script lang="ts">
	import {
		MIN_ANIMATION_SPEED,
		MAX_ANIMATION_SPEED,
		DEFAULT_ANIMATION_SPEED
	} from '$lib/helpers/consts';
	import { getSortAnimations, calculateAnimationSpeed, generateArray } from '../helpers/helpers';

	// inputs
	let arrayLength = 50;
	let speedInput = DEFAULT_ANIMATION_SPEED;
	$: speed = calculateAnimationSpeed(speedInput);

	// main array
	let array = generateArray(arrayLength);
	function handleArrayLengthChange() {
		array = generateArray(arrayLength);
		currentActiveArray = Array.from({ length: arrayLength }, (_, index) => index);
	}

	// helpers for UI
	let currentActiveArray = Array.from({ length: arrayLength }, (_, index) => index);
	let activeBarIndex = -1;
	let barsComparedIndexes: number[] = [];
	let animationRunning = false;

	function sortMerge() {
		animationRunning = true;
		const [_, animations] = getSortAnimations(array.slice());

		for (var i = 0; i < animations.length; i++) {
			const currentAnimation = animations[i];

			setTimeout((_: any) => {
				// on each animation unset the active bar index to remove the color highlight
				activeBarIndex = -1;

				if (currentAnimation.type == 'ARRAY') {
					barsComparedIndexes = [];
					currentActiveArray = [];

					let bars = getAllBars();

					// elevate all the bars of the currently active array
					for (var i = currentAnimation.first; i <= currentAnimation.second; i++) {
						currentActiveArray.push(i);
						bars[i].style.bottom = '40vh';
					}
				} else if (currentAnimation.type == 'COMPARE') {
					barsComparedIndexes = [];
					barsComparedIndexes.push(currentAnimation.first, currentAnimation.second);
				} else if (currentAnimation.type == 'PICK_MIN') {
					let bars = getAllBars();

					for (var i = 0; i < bars.length; i++) {
						bars[i].style.transitionProperty = 'left, bottom';
					}

					let activeBar = bars.item(currentAnimation.second);
					activeBarIndex = currentAnimation.second;

					let currentLeft = parseInt(activeBar?.style.left);
					currentLeft = (100 / array.length) * currentAnimation.first;
					activeBar.style.left = `${currentLeft}%`;
					activeBar.style.bottom = '0';

					// crucial step
					// we need to sort all the bars by their updated positions
					// if they are sorted and all the bars in their own place
					// we need to reassign the original array to be up to date
					let sortedBars = [...bars].sort(
						(a, b) => parseInt(a.style.left) - parseInt(b.style.left)
					);
					let barLeftValues = sortedBars.map((x) => x.style.left);
					let allUnique = barLeftValues.length === new Set(barLeftValues).size;

					if (allUnique) {
						setTimeout((_) => {
							// remove the 'left' transition property to omit glitch when reassigning the main array
							for (var i = 0; i < sortedBars.length; i++) {
								sortedBars[i].style.transitionProperty = 'bottom';
							}

							for (var i = 0; i < sortedBars.length; i++) {
								array[i] = parseInt(sortedBars[i].getAttribute('data-value')!);
								activeBarIndex = -1;
								barsComparedIndexes = [];
							}
						}, speed - 10);
					}
				}
			}, i * speed);
		}

		// unblock the UI after
		setTimeout((_: any) => {
			animationRunning = false;
			activeBarIndex = -1;
			barsComparedIndexes = [];
		}, animations.length * speed);
	}

	function getAllBars() {
		return document.getElementById('bars')?.childNodes! as NodeListOf<HTMLElement>;
	}
</script>

<div class="flex flex-col h-screen">
	<div class="grid grid-cols-3 grid-rows-1 gap-5 items-center text-center">
		<div class="col-span-1 flex flex-col">
			<label for="speed">Speed</label>
			<input
				type="range"
				bind:value={speedInput}
				max={MAX_ANIMATION_SPEED}
				min={MIN_ANIMATION_SPEED}
				disabled={animationRunning}
				id="speed"
				name="speed"
			/>
		</div>
		<div class="col-span-1 flex flex-col">
			<label for="Size">Size</label>
			<input
				bind:value={arrayLength}
				on:change={handleArrayLengthChange}
				type="range"
				max="100"
				min="10"
				disabled={animationRunning}
				id="size"
				name="size"
			/>
		</div>
		<div class="col-span-1 p-5">
			<button
				type="button"
				on:click={sortMerge}
				disabled={animationRunning}
				class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
			>
				{#if animationRunning}
					<svg
						aria-hidden="true"
						role="status"
						class="inline w-4 h-4 mr-3 text-white animate-spin"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="#E5E7EB"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentColor"
						/>
					</svg>
				{/if}

				Merge sort</button
			>
		</div>
	</div>
	<div class="flex flex-row items-end w-10/12 mx-20" id="bars">
		{#each array as item, index}
			<div
				data-value={item}
				class="bg-[#040F0F] text-white align-bottom absolute text-xs rounded-md"
				style="
				height: {7 * item}px; 
				opacity: {currentActiveArray.includes(index) ? '1' : '.2'};
				width: calc(100%/{array.length} - 5px);
				left: {(100 / array.length) * index}%;
				transition-duration: 250ms;
				transition-property: bottom;
				bottom: 0;
				border: {activeBarIndex == index
					? '3px solid #EF767A'
					: barsComparedIndexes.includes(index)
					? '3px solid #23F0C7'
					: '#040F0F'};"
			>
				<p class="text-center pt-5">{item}</p>
			</div>
		{/each}
	</div>
</div>
