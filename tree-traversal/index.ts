type BinaryNode = {
	idx: number,
	value: number,
	left?: BinaryNode,
	right?: BinaryNode
}

enum TraverseType {
	Pre,
	In,
	Post
}

const MAX_LEVEL = 6;
let idx = 0;

function draw_node(node: BinaryNode, current_level: number) {
	let level_div = document.querySelector(`div.level-${current_level}`);
	if (!level_div) {
		level_div = document.createElement('div');
		level_div.classList.add(`level-${current_level}`, 'level');
		const tree_element = document.querySelector('main');
		tree_element?.appendChild(level_div);
	}

	const div = document.createElement('div');
	div.classList.add('node');
	div.innerText = node.value.toString();
	div.dataset['idx'] = node.idx.toString();

	level_div.appendChild(div);
}

function walk_and_draw(node: BinaryNode | undefined, current_level: number): void {
	if (!node) {
		return;
	}

	draw_node(node, current_level);

	current_level += 1;
	walk_and_draw(node.left, current_level);
	walk_and_draw(node.right, current_level);
}

function fill_tree(node: BinaryNode, level: number, max_level: number) {
	if (level >= max_level) {
		return;
	}

	const left: BinaryNode = { value: Math.floor(Math.random() * 99), idx: idx++ };
	const right: BinaryNode = { value: Math.floor(Math.random() * 99), idx: idx++ };

	node.left = left;
	node.right = right;

	level += 1;
	fill_tree(node.left, level, max_level);
	fill_tree(node.right, level, max_level);
}

function walk(node: BinaryNode | undefined, current_level: number, path: number[], traverseType: TraverseType): number[] {
	if (!node) {
		return path;
	}

	current_level += 1;
	if (traverseType == TraverseType.Pre) {
		path.push(node.idx);
	}
	walk(node.left, current_level, path, traverseType);
	if (traverseType == TraverseType.In) {
		path.push(node.idx);
	}
	walk(node.right, current_level, path, traverseType);
	if (traverseType == TraverseType.Post) {
		path.push(node.idx);
	}

	return path;
}

function traverse(head: BinaryNode, traverseType:  TraverseType): number[] {
	const path: number[] = [];
	walk(head, 1, path, traverseType);
	return path;
}

function highlight_path(path: number[]) {
	let idx = 1;
	path.forEach(el => {
		const node = document.querySelector(`[data-idx="${el}"]`);
		setTimeout(() => {
			node?.classList.add('highlight');
		}, idx++ * 200);
	});
}

const root: BinaryNode = { value: Math.floor(Math.random() * 99), idx: idx };
fill_tree(root, 1, MAX_LEVEL);
const result = walk_and_draw(root, 1);

const preButton = document.querySelector('.pre');
const inButton = document.querySelector('.in');
const postButton = document.querySelector('.post');

preButton?.addEventListener('click', () => highlight_path(traverse(root, TraverseType.Pre)));
inButton?.addEventListener('click', () => highlight_path(traverse(root, TraverseType.In)));
postButton?.addEventListener('click', () => highlight_path(traverse(root, TraverseType.Post)));
