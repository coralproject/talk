/**
 * Find ancestor with given tag or whith callback returning true.
 */
export function findAncestor(node, tagOrCallback) {
  const callback =
    typeof tagOrCallback === 'function'
      ? tagOrCallback
      : n => n.tagName === tagOrCallback;
  while (node.parentNode) {
    node = node.parentNode;
    if (callback(node)) {
      return node;
    }
  }
  return null;
}

/**
 * Find child with given tag or when callback return true.
 */
export function findChild(node, tagOrCallback) {
  const callback =
    typeof tagOrCallback === 'function'
      ? tagOrCallback
      : n => n.tagName === tagOrCallback;
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (callback(child)) {
      return child;
    }
    const found = findChild(child, tagOrCallback);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Find an node intersecting with the selection with given tag or
 * with callback returning true.
 */
export function findIntersecting(tagOrCallback) {
  const callback =
    typeof tagOrCallback === 'function'
      ? tagOrCallback
      : n => n.tagName === tagOrCallback;

  const range = getSelectionRange();
  if (!range) {
    return null;
  }

  if (callback(range.startContainer)) {
    return range.startContainer;
  }

  const ancestor = findAncestor(range.startContainer, callback);
  if (ancestor) {
    return ancestor;
  }

  const nodes = getSelectedChildren(range.commonAncestorContainer);
  for (let i = 0; i < nodes.length; i++) {
    if (callback(nodes[i])) {
      return nodes[i];
    }
    const found = findChild(nodes[i], callback);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Same as node.contains but works in IE.
 * In addition lookFor can also be a callback.
 */
export function nodeContains(node, lookFor) {
  const callback =
    typeof lookFor === 'function' ? lookFor : n => n.isSameNode(lookFor);
  if (callback(node)) {
    return true;
  }
  return !!findChild(node, callback);
}

/**
 * Returns true if node is not `inline` nor `inline-block`.
 */
export function isBlockElement(node) {
  if (node.nodeName === '#text') {
    return false;
  }
  return !window
    .getComputedStyle(node)
    .getPropertyValue('display')
    .startsWith('inline');
}

/**
 * Find parent that is a block element.
 */
export function findParentBlock(node) {
  return findAncestor(node, isBlockElement);
}

/**
 * Find last parent before a block element.
 */
export function lastParentBeforeBlock(node) {
  return findAncestor(node, n => !n.parentNode || isBlockElement(n.parentNode));
}

/**
 * Like `Array.indexOf` but works on `childNodes`.
 */
export function indexOfChildNode(parent, child) {
  for (let i = 0; i < parent.childNodes.length; i++) {
    if (parent.childNodes[i] === child) {
      return i;
    }
  }
  return -1;
}

/**
 * Same as `document.execCommand('insertText', false, text)` but also
 * works for IE. Changes Selection.
 */
export function insertText(text) {
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    document.execCommand('delete');
  }
  const range = selection.getRangeAt(0);
  const offset = range.startOffset;
  const container = range.startContainer;

  if (container.nodeName === '#text') {
    container.textContent =
      container.textContent.slice(0, offset) +
      text +
      container.textContent.slice(offset);
    const nextOffset = offset + text.length;
    range.setStart(container, nextOffset);
    range.setEnd(container, nextOffset);
  } else {
    const textNode = document.createTextNode(text);
    container.insertBefore(textNode, container.childNodes[offset]);
    range.setStart(textNode, text.length);
    range.setEnd(textNode, text.length);
  }
}

/**
 * Insert nodes to current selection,
 * does not change selection.
 */
export function insertNodes(...nodes) {
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    document.execCommand('delete');
  }
  const range = selection.getRangeAt(0);
  const offset = range.startOffset;
  const container = range.startContainer;
  if (container.nodeName === '#text') {
    const startSlice = container.textContent.slice(0, offset);
    const endSlice = container.textContent.slice(offset);
    if (startSlice) {
      nodes.splice(0, 0, document.createTextNode(startSlice));
    }
    if (endSlice) {
      nodes.push(document.createTextNode(endSlice));
    }
    const parentNode = container.parentNode;
    nodes.forEach(n => parentNode.insertBefore(n, container));
    parentNode.removeChild(container);
  } else {
    let parentNode = container;
    let nextSibling = container.childNodes[offset];
    nodes.forEach(n => parentNode.insertBefore(n, nextSibling));
  }
}

/**
 * Helper to replace current selection with range.
 */
export function replaceSelection(range) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Helper to to know if selection is collapsed.
 */
export function isSelectionCollapsed() {
  return window.getSelection().isCollapsed;
}

/**
 * Helper to get current selection range.
 */
export function getSelectionRange() {
  const selection = window.getSelection();
  return selection.rangeCount ? selection.getRangeAt(0) : null;
}

// Adds a 'br' marker at the end of the node.
function ensureEndMarker(node) {
  if (
    !node.lastChild ||
    node.lastChild.tagName !== 'BR' ||
    node.lastChild.className !== 'coral-rte-end-marker'
  ) {
    const br = document.createElement('br');
    br.className = 'coral-rte-end-marker';
    node.appendChild(br);
  }
}

/**
 * Returns true if selection is completely inside
 * given node.
 */
export function selectionIsInside(node) {
  const range = getSelectionRange();
  return (
    range &&
    (nodeContains(node, range.startContainer) ||
      nodeContains(node, range.endContainer))
  );
}

/**
 * Append a newline to the node.
 */
export function appendNewLine(node, changeSelection) {
  const el = document.createElement('br');
  node.appendChild(el);

  if (changeSelection) {
    const offset = indexOfChildNode(node, el);
    const range = document.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset);
    replaceSelection(range);
  }
}

/**
 * Insert new line. This is what happens
 * when adding new lines through pressing Enter.
 * Deals with browers quirks.
 */
export function insertNewLine(changeSelection) {
  // Insert <br> node.
  const el = document.createElement('br');
  insertNodes(el);

  // Calculate next selection.
  const range = document.createRange();
  if (el.nextSibling) {
    const offset = indexOfChildNode(el.parentNode, el.nextSibling);
    range.setStart(el.parentNode, offset);
    range.setEnd(el.parentNode, offset);
  } else {
    // We need to add a <br> marker at the end, because we can't
    // select the last <br>.
    ensureEndMarker(el.parentNode);

    const offset = el.parentNode.childNodes.length - 1;
    range.setStart(el.parentNode, offset);
    range.setEnd(el.parentNode, offset);
  }

  if (changeSelection) {
    replaceSelection(range);
  }
}

/**
 * Inserts a new line after given node.
 */
export function insertNewLineAfterNode(node, changeSelection) {
  if (node.parentNode.lastChild === node) {
    appendNewLine(node.parentNode, changeSelection);
  } else {
    if (changeSelection) {
      const offset = indexOfChildNode(node.parentNode, node) + 1;
      const range = document.createRange();
      range.setStart(node.parentNode, offset);
      range.setEnd(node.parentNode, offset);
      replaceSelection(range);
    }
    insertNewLine();
  }
}

/**
 * Given a container and a offset, return the selected
 * node. Usually to resolve the start or end of a range.
 */
export function getRangeNode(container, offset) {
  if (container.nodeName === '#text') {
    return container;
  }
  return container.childNodes[offset];
}

/**
 * Returns an array of all nodes before `node`.
 */
export function getLeftOfNode(node) {
  let result = [];
  let leftMost = node;
  while (
    leftMost.previousSibling &&
    leftMost.previousSibling.tagName !== 'BR' &&
    !isBlockElement(leftMost.previousSibling)
  ) {
    result.splice(0, 0, leftMost.previousSibling);
    leftMost = leftMost.previousSibling;
  }
  return result;
}

/**
 * Returns an array of all nodes after `node`.
 */
export function getRightOfNode(node) {
  let result = [];
  let cur = node;
  while (
    cur.nextSibling &&
    cur.nextSibling.tagName !== 'BR' &&
    !isBlockElement(cur.nextSibling)
  ) {
    cur = cur.nextSibling;
    result.push(cur);
  }
  if (cur.nextSibling && cur.nextSibling.tagName === 'BR') {
    result.push(cur.nextSibling);
  }
  return result;
}

/**
 * Given `node` find the line it belongs too
 * and return the whole line as an array.
 */
export function getWholeLine(node) {
  if (isBlockElement(node)) {
    return [node];
  }
  const child = isBlockElement(node.parentNode)
    ? node
    : lastParentBeforeBlock(node);
  if (child.tagName === 'BR') {
    return [...getLeftOfNode(child), child];
  }
  return [...getLeftOfNode(child), child, ...getRightOfNode(child)];
}

/**
 * Get selected line at the start of the selection.
 * Returns an array of nodes.
 */
export function getSelectedLine() {
  const range = getSelectionRange();
  if (!range) {
    return [];
  }
  const start = getRangeNode(range.startContainer, range.startOffset);
  return start ? getWholeLine(start) : [];
}

/**
 * Finds a commen block ancestor in the selection
 * and return "whole" lines as an array of nodes.
 */
export function getSelectedNodesExpanded() {
  const range = getSelectionRange();
  if (!range) {
    return [];
  }

  if (range.collapsed) {
    return getSelectedLine();
  }

  let ancestor = range.commonAncestorContainer;
  if (!isBlockElement(ancestor)) {
    ancestor = findParentBlock(ancestor);
  }

  const result = getSelectedChildren(ancestor);
  return [
    ...getLeftOfNode(result[0]),
    ...result,
    ...getRightOfNode(result[result.length - 1]),
  ];
}

/**
 * Returns array of children that intersects with
 * the selection.
 */
export function getSelectedChildren(ancestor) {
  const result = [];
  const range = getSelectionRange();
  if (!range) {
    return result;
  }
  if (!range) {
    return result;
  }

  const start = getRangeNode(range.startContainer, range.startOffset);
  const end = getRangeNode(range.endContainer, range.endOffset);
  let foundStart = false;
  for (let i = 0; i < ancestor.childNodes.length; i++) {
    const node = ancestor.childNodes[i];
    if (!foundStart) {
      if (nodeContains(node, start)) {
        foundStart = true;
      }
    }
    if (foundStart) {
      result.push(node);
      if (nodeContains(node, end)) {
        break;
      }
    }
  }
  return result;
}

/**
 * Removes node and assimilate its children with the parent.
 */
export function outdentNode(node, changeSelection) {
  const parentNode = node.parentNode;
  const offset = indexOfChildNode(parentNode, node);
  while (node.firstChild) {
    parentNode.insertBefore(node.firstChild, node);
  }
  parentNode.removeChild(node);

  if (changeSelection) {
    const range = document.createRange();
    range.setStart(parentNode, offset);
    range.setEnd(parentNode, offset);
    replaceSelection(range);
  }
}

function cloneNodeAndRangeHelper(node, range, rangeCloned) {
  const nodeCloned = node.cloneNode(false);
  node.childNodes.forEach(n =>
    nodeCloned.appendChild(cloneNodeAndRangeHelper(n, range, rangeCloned))
  );
  if (range.startContainer === node) {
    rangeCloned.setStart(nodeCloned, range.startOffset);
  }
  if (range.endContainer === node) {
    rangeCloned.setEnd(nodeCloned, range.endOffset);
  }
  return nodeCloned;
}

/**
 * Clones node and returns both the cloned node and an equivalent Range.
 */
export function cloneNodeAndRange(node, range) {
  const rangeCloned = range.cloneRange();
  const nodeCloned = cloneNodeAndRangeHelper(node, range, rangeCloned);
  if (
    rangeCloned.startContainer === range.startContainer ||
    rangeCloned.endContainer === range.endContainer
  ) {
    throw new Error('Range not inside node');
  }
  return [nodeCloned, rangeCloned];
}

/**
 * Take children of the second node and replace children of first node.
 */
export function replaceNodeChildren(node, node2) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  while (node2.firstChild) {
    node.appendChild(node2.firstChild);
  }
}

/**
 * Tries to select the end of node.
 * Currently looks for <br> and text nodes to find a suitable
 * candidate for a selection.
 */
export function selectEndOfNode(node) {
  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    let child = node.childNodes[i];
    const s = selectEndOfNode(child);
    if (s) {
      return true;
    }
    if (child.tagName === 'BR') {
      if (
        child.previousSibling &&
        child.previousSibling.childName === '#text'
      ) {
        child = child.previousSibling;
      } else {
        const offset = indexOfChildNode(node, child);
        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset);
        replaceSelection(range);
        return true;
      }
    }
    if (child.nodeName === '#text') {
      const range = document.createRange();
      range.setStart(child, child.textContent.length);
      range.setEnd(child, child.textContent.length);
      replaceSelection(range);
      return true;
    }
  }
  return false;
}
