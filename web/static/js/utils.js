// utility functions

// clear element children
export function clear(node) {
  while (node.lastChild) node.removeChild(node.lastChild);
}
