/**
 * Traverse DOM tree until callback returns anything.
 */
export function traverse(node, callback) {
  let result;
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    result = callback(child);
    if (result === undefined) {
      result = traverse(child, callback);
    }
    if (result !== undefined) {
      return result;
    }
  }
}

/**
 * Traverse DOM tree backwards until callback returns anything.
 * If hits limitTo returns null.
 */
export function traverseUp(node, callback, limitTo) {
  let result;
  if (node.isSameNode(limitTo)) {
    return null;
  }
  while (node.parentNode) {
    node = node.parentNode;
    result = callback(node);
    if (result !== undefined) {
      return result;
    }
    if (limitTo && node.isSameNode(limitTo)) {
      return null;
    }
  }
}

/**
 * Find ancestor with given tag or whith callback returning true.
 * If `limitTo` is passed, the search is limited to this container.
 */
export function findAncestor(node, tagOrCallback, limitTo) {
  const callback =
    typeof tagOrCallback === 'function'
      ? tagOrCallback
      : n => n.tagName === tagOrCallback;
  return (
    traverseUp(
      node,
      n => {
        if (callback(n)) {
          return n;
        }
      },
      limitTo
    ) || null
  );
}

/**
 * Find child with given tag or when callback return true.
 */
export function findChild(node, tagOrCallback) {
  const callback =
    typeof tagOrCallback === 'function'
      ? tagOrCallback
      : n => n.tagName === tagOrCallback;
  return (
    traverse(node, n => {
      if (callback(n)) {
        return n;
      }
    }) || null
  );
}

/**
 * Find an node intersecting with the selection with given tag or
 * with callback returning true. If `limitTo` is passed, the search
 * is limited to this container.
 */
export function findIntersecting(tagOrCallback, limitTo) {
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

  const ancestor = findAncestor(range.startContainer, callback, limitTo);
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
  const range = selection.getRangeAt(0);
  if (!range.collapsed) {
    range.deleteContents();
  }
  const newRange = document.createRange();
  const offset = range.startOffset;
  const container = range.startContainer;

  if (container.nodeName === '#text') {
    container.textContent =
      container.textContent.slice(0, offset) +
      text +
      container.textContent.slice(offset);
    const nextOffset = offset + text.length;

    newRange.setStart(container, nextOffset);
    newRange.setEnd(container, nextOffset);
  } else {
    const textNode = document.createTextNode(text);
    container.insertBefore(textNode, container.childNodes[offset]);
    newRange.setStart(textNode, text.length);
    newRange.setEnd(textNode, text.length);
  }
  replaceSelection(newRange);
}

/**
 * Insert nodes to current selection,
 * does not change selection.
 */
export function insertNodes(...nodes) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  if (!range.collapsed) {
    range.deleteContents();
  }
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

// Adds a bogus 'br' at the end of the node if not existant.
export function addBogusBR(node) {
  if (!isBlockElement(node)) {
    return;
  }
  if (!node.lastChild || !isBogusBR(node.lastChild)) {
    node.appendChild(document.createElement('br'));
  }
}

/**
 * Returns true if selection is completely inside
 * given nodes.
 */
export function isSelectionInside(...nodes) {
  let foundStart = false;
  const range = getSelectionRange();
  if (!range) {
    return false;
  }
  for (let i = 0; i < nodes.length; i++) {
    if (!foundStart) {
      foundStart = nodeContains(nodes[i], range.startContainer);
    }
    if (foundStart) {
      const foundEnd = nodeContains(nodes[i], range.endContainer);
      if (foundEnd) {
        return true;
      }
    }
  }
  return false;
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

  // If we are adding to the end of the node, we also need
  // to add a bogus br.
  if (!el.nextSibling) {
    el.parentNode.appendChild(document.createElement('br'));
  }

  // Adding directly before a block element needs also a bogus br.
  if (el.nextSibling && isBlockElement(el.nextSibling)) {
    el.parentNode.insertBefore(document.createElement('br'), el.nextSibling);
  }

  // Calculate next selection.
  const range = document.createRange();
  if (el.nextSibling) {
    const offset = indexOfChildNode(el.parentNode, el.nextSibling);
    range.setStart(el.parentNode, offset);
    range.setEnd(el.parentNode, offset);
  } else {
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
  const el = document.createElement('br');
  if (node.nextSibling) {
    node.parentNode.insertBefore(el, node.nextSibling);
  } else {
    node.parentNode.appendChild(el);
  }

  if (changeSelection) {
    const offset = indexOfChildNode(node.parentNode, el);
    const range = document.createRange();
    range.setStart(node.parentNode, offset);
    range.setEnd(node.parentNode, offset);
    replaceSelection(range);
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

export function isBogusBR(node) {
  return (
    (!node.previousSibling || !isBlockElement(node.previousSibling)) &&
    node.tagName === 'BR' &&
    (!node.nextSibling || isBlockElement(node.previousSibling))
  );
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
  if (
    cur.nextSibling &&
    cur.nextSibling.tagName === 'BR' &&
    !isBogusBR(cur.nextSibling)
  ) {
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
export function outdentBlock(node, changeSelection) {
  // Save previous range.
  const selectionWasInside = isSelectionInside(node);
  const {
    startContainer,
    startOffset,
    endContainer,
    endOffset,
  } = getSelectionRange();

  // Remove bogus br
  if (node.lastChild && node.lastChild.tagName === 'BR') {
    node.removeChild(node.lastChild);
  }

  // A new lines to substitute the missing block element.
  const needLineAfter =
    node.nextSibling &&
    !isBlockElement(node.nextSibling) &&
    node.lastChild &&
    !isBlockElement(node.lastChild);
  const needLineBefore =
    node.previousSibling &&
    !isBlockElement(node.previousSibling) &&
    node.previousSibling.tageName !== 'BR';

  const parentNode = node.parentNode;

  if (needLineBefore) {
    parentNode.insertBefore(document.createElement('BR'), node);
  }

  const previousOffset = indexOfChildNode(parentNode, node);

  while (node.firstChild) {
    parentNode.insertBefore(node.firstChild, node);
  }

  if (needLineAfter) {
    parentNode.insertBefore(document.createElement('BR'), node);
  }

  parentNode.removeChild(node);

  if (changeSelection) {
    const range = document.createRange();

    if (selectionWasInside) {
      if (startContainer === node) {
        range.setStart(parentNode, startOffset + previousOffset);
      } else {
        range.setStart(startContainer, startOffset);
      }
      if (endContainer === node) {
        range.setEnd(parentNode, endOffset + previousOffset);
      } else {
        range.setEnd(endContainer, endOffset);
      }
    } else {
      range.setStart(parentNode, previousOffset);
      range.setEnd(parentNode, previousOffset);
    }
    replaceSelection(range);
  }
}

/**
 * Indent children.
 */
export function indentNodes(nodes, tagName, changeSelection) {
  const parentNode = nodes[0].parentNode;
  const node = document.createElement(tagName);

  // Remove bogus BR if the blockquote is the last element.
  // Otherwise there will be an unwanted empty line.
  const lastNode = nodes[nodes.length - 1];
  if (
    lastNode.nextSibling === parentNode.lastChild &&
    isBogusBR(parentNode.lastChild)
  ) {
    parentNode.removeChild(parentNode.lastChild);
  }

  const firstNode = nodes[0];
  // Remove previous br as it is not needed
  if (firstNode.previousSibling && firstNode.previousSibling.tagName === 'BR') {
    parentNode.removeChild(firstNode.previousSibling);
  }

  // Finally indent.
  parentNode.insertBefore(node, firstNode);
  nodes.forEach(n => {
    node.appendChild(n);
  });

  if (changeSelection) {
    selectEndOfNode(node);
  }

  return node;
}

function cloneNodeAndRangeHelper(node, range, rangeCloned) {
  const nodeCloned = node.cloneNode(false);
  for (let i = 0; i < node.childNodes.length; i++) {
    const n = node.childNodes[i];
    nodeCloned.appendChild(cloneNodeAndRangeHelper(n, range, rangeCloned));
  }
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
