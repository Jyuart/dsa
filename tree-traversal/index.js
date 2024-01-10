"use strict";
var TraverseType;
(function (TraverseType) {
    TraverseType[TraverseType["Pre"] = 0] = "Pre";
    TraverseType[TraverseType["In"] = 1] = "In";
    TraverseType[TraverseType["Post"] = 2] = "Post";
})(TraverseType || (TraverseType = {}));
const MAX_LEVEL = 6;
let idx = 0;
function draw_node(node, current_level) {
    let level_div = document.querySelector(`div.level-${current_level}`);
    if (!level_div) {
        level_div = document.createElement('div');
        level_div.classList.add(`level-${current_level}`, 'level');
        const tree_element = document.querySelector('main');
        tree_element === null || tree_element === void 0 ? void 0 : tree_element.appendChild(level_div);
    }
    const div = document.createElement('div');
    div.classList.add('node');
    div.innerText = node.value.toString();
    div.dataset['idx'] = node.idx.toString();
    level_div.appendChild(div);
}
function walk_and_draw(node, current_level) {
    if (!node) {
        return;
    }
    draw_node(node, current_level);
    current_level += 1;
    walk_and_draw(node.left, current_level);
    walk_and_draw(node.right, current_level);
}
function fill_tree(node, level, max_level) {
    if (level >= max_level) {
        return;
    }
    const left = { value: Math.floor(Math.random() * 99), idx: idx++ };
    const right = { value: Math.floor(Math.random() * 99), idx: idx++ };
    node.left = left;
    node.right = right;
    level += 1;
    fill_tree(node.left, level, max_level);
    fill_tree(node.right, level, max_level);
}
function walk(node, current_level, path, traverseType) {
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
function traverse(head, traverseType) {
    const path = [];
    walk(head, 1, path, traverseType);
    return path;
}
function highlight_path(path) {
    let idx = 1;
    path.forEach(el => {
        const node = document.querySelector(`[data-idx="${el}"]`);
        setTimeout(() => {
            node === null || node === void 0 ? void 0 : node.classList.add('highlight');
        }, idx++ * 200);
    });
}
const root = { value: Math.floor(Math.random() * 99), idx: idx };
fill_tree(root, 1, MAX_LEVEL);
const result = walk_and_draw(root, 1);
const preButton = document.querySelector('.pre');
const inButton = document.querySelector('.in');
const postButton = document.querySelector('.post');
preButton === null || preButton === void 0 ? void 0 : preButton.addEventListener('click', () => highlight_path(traverse(root, TraverseType.Pre)));
inButton === null || inButton === void 0 ? void 0 : inButton.addEventListener('click', () => highlight_path(traverse(root, TraverseType.In)));
postButton === null || postButton === void 0 ? void 0 : postButton.addEventListener('click', () => highlight_path(traverse(root, TraverseType.Post)));
