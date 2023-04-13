import Node from "./Node";

export default class Tree {
  constructor() {
    this.root = null;
  }

  buildTree(array) {
    const tempArray = [];
    array.map((element) =>
      tempArray.includes(element) ? null : tempArray.push(element)
    );
    tempArray.sort((a, b) => a - b);

    function createTree(array, start, end) {
      if (start > end) return null;

      const mid = Math.floor((start + end) / 2);
      const root = new Node(array[mid]);

      root.left = createTree(array, start, mid - 1);
      root.right = createTree(array, mid + 1, end);

      return root;
    }
    this.root = createTree(tempArray, 0, tempArray.length - 1);

    return this.root;
  }

  insert(value, node = this.root) {
    if (node === null) return new Node(value);
    if (node.data === value) return node;

    if (node.data > value) {
      node.left = this.insert(value, node.left);
    } else {
      node.right = this.insert(value, node.right);
    }
    return node;
  }

  delete(value) {
    this.root = deleteNode(value, this.root);
  }

  find(value) {
    let foundNode = this.root;
    while (foundNode && foundNode.data !== value) {
      if (foundNode.data > value) {
        foundNode = foundNode.left;
      } else {
        foundNode = foundNode.right;
      }
    }
    if (!foundNode) return "node doesn't exist";
    return foundNode;
  }

  levelOrder(callback) {
    if (this.root === null) return;
    const results = [];
    const cb = callback || ((data) => results.push(data));
    const queue = [this.root];

    while (queue.length) {
      const currentNode = queue.shift();
      cb(currentNode.data);
      currentNode.left && queue.push(currentNode.left);
      currentNode.right && queue.push(currentNode.right);
    }

    if (results.length) return results;
  }

  inorder(callback) {
    let results = [];
    const recursiveCallback =
      callback || ((nodeData) => results.push(nodeData));

    function inOrderRecursive(callback, root) {
      if (!root) return;

      inOrderRecursive(callback, root.left);
      callback(root.data);
      inOrderRecursive(callback, root.right);
    }
    inOrderRecursive(recursiveCallback, this.root);

    if (results.length) return results;
  }

  preOrder(callback) {
    let results = [];
    const recursiveCallback =
      callback || ((nodeData) => results.push(nodeData));

    function preOrderRecursive(callback, root) {
      if (!root) return;

      callback(root.data);
      preOrderRecursive(callback, root.left);
      preOrderRecursive(callback, root.right);
    }
    preOrderRecursive(recursiveCallback, this.root);
    if (results.length) return results;
  }

  postOrder(callback) {
    let results = [];
    const recursiveCallback =
      callback || ((nodeData) => results.push(nodeData));

    function postOrderNoCallback(callback, root) {
      if (!root) return;

      postOrderNoCallback(callback, root.left);
      postOrderNoCallback(callback, root.right);
      return callback(root.data);
    }
    postOrderNoCallback(recursiveCallback, this.root);
    if (results.length) return results;
  }

  height(node) {
    const foundNode = this.find(node);

    if (typeof foundNode === "string") return foundNode;

    function foundHeight(node, height) {
      if (!node.left && !node.right) return height;

      let count = height + 1;
      let right = 0;
      let left = 0;

      if (node.left) {
        left = foundHeight(node.left, count);
      }

      if (node.right) {
        right = foundHeight(node.right, count);
      }
      return left > right ? left : right;
    }
    return foundHeight(foundNode, 0);
  }

  depth(value) {
    let foundNode = this.root;
    let depth = 0;
    while (foundNode && foundNode.data !== value) {
      depth += 1;
      if (foundNode.data > value) {
        foundNode = foundNode.left;
      } else {
        foundNode = foundNode.right;
      }
    }
    if (!foundNode) return "node doesn't exist";
    return depth;
  }

  isBalanced() {
    const root = this.root;
    if (!root) return null;
    const left = (root.left?.data && this.height(root.left.data)) ?? 0;
    const right = (root.right?.data && this.height(root.right.data)) ?? 0;

    if (right - left <= 1) {
      return true;
    }
    return false;
  }

  rebalance() {
    return this.buildTree(this.levelOrder());
  }
}

function deleteNode(value, root) {
  if (root === null) return root;

  if (root.data > value) {
    root.left = deleteNode(value, root.left);
  } else if (root.data < value) {
    root.right = deleteNode(value, root.right);
  } else {
    if (!root.right) return root.left;
    if (!root.left) return root.right;

    root.data = findLowestNode(root.right);
    root.right = deleteNode(root.data, root.right);
  }
  return root;
}

function findLowestNode(root) {
  let tempNode = root;
  let lowest = null;
  if (!tempNode.left) return tempNode.data;

  while (tempNode.left) {
    tempNode = tempNode.left;
    lowest = tempNode.data;
  }
  return lowest;
}

let arbol = new Tree();
arbol.buildTree([4, 10, 12, 15, 22, 18, 24, 25, 50, 35, 31, 44, 70, 66, 90, 9]);
prettyPrint(arbol.root);

function prettyPrint(node, prefix = "", isLeft = true) {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
}
