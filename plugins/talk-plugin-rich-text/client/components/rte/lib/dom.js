export function findAncestorWithTag(node, tag) {
  do {
    if (node.nodeName === tag) {
      return node;
    }
    node = node.parentNode;
  } while (node);
  return false;
}

export function findIntersectingTag(tag) {
  const range = getSelectionRange();
  if (!range) {
    return null;
  }

  const ancestor = findAncestorWithTag(range.startContainer, tag);
  if (ancestor) {
    return ancestor;
  }

  const nodes = getSelectedChildren(range.commonAncestorContainer);
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].tagName === tag) {
      return nodes[i];
    }
    const query = nodes[i].querySelector && nodes[i].querySelector(tag);
    if (query) {
      return query;
    }
  }
  return null;
}

export function indexOfChildNode(parent, child) {
  for (let i = 0; i < parent.childNodes.length; i++) {
    if (parent.childNodes[i] === child) {
      return i;
    }
  }
  return -1;
}

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

export function replaceSelection(range) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

export function isSelectionCollapsed() {
  return window.getSelection().isCollapsed;
}

export function getSelectionRange() {
  const selection = window.getSelection();
  return selection.rangeCount ? selection.getRangeAt(0) : null;
}

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

export function nodeContains(node, lookFor) {
  if (node.isSameNode(lookFor)) {
    return true;
  }
  for (let i = 0; i < node.childNodes.length; i++) {
    if (nodeContains(node.childNodes[i], lookFor)) {
      return true;
    }
  }
  return false;
}

export function selectionIsInside(node) {
  const range = getSelectionRange();
  return (
    range &&
    (nodeContains(node, range.startContainer) ||
      nodeContains(node, range.endContainer))
  );
}

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

export function getSelectedNode(container, offset) {
  if (container.nodeName === '#text') {
    return container;
  }
  return container.childNodes[offset];
}

export function isBlockElement(node) {
  if (node.nodeName === '#text') {
    return false;
  }
  return !window
    .getComputedStyle(node)
    .getPropertyValue('display')
    .startsWith('inline');
}

export function findParentBlock(node) {
  if (!node.parentNode) {
    return null;
  }
  if (isBlockElement(node.parentNode)) {
    return node.parentNode;
  }
  return findParentBlock(node.parentNode);
}

export function lastParentBeforeBlock(node) {
  let child = node;
  while (!isBlockElement(child.parentNode)) {
    child = node.parentNode;
  }
  return child;
}

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

export function getWholeLine(node) {
  if (isBlockElement(node)) {
    return [node];
  }
  const child = lastParentBeforeBlock(node);
  if (child.tagName === 'BR') {
    return [...getLeftOfNode(child), child];
  }
  return [...getLeftOfNode(child), child, ...getRightOfNode(child)];
}

export function getSelectedLine() {
  const range = getSelectionRange();
  if (!range) {
    return [];
  }
  const start = getSelectedNode(range.startContainer, range.startOffset);
  return start ? getWholeLine(start) : [];
}

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

export function getSelectedChildren(ancestor) {
  const result = [];
  const range = getSelectionRange();
  if (!range) {
    return result;
  }
  if (!range) {
    return result;
  }

  const start = getSelectedNode(range.startContainer, range.startOffset);
  const end = getSelectedNode(range.endContainer, range.endOffset);
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

export function outdentNode(node, changeSelection) {
  const parentNode = node.parentNode;
  const offset = indexOfChildNode(parentNode, node);
  while (node.childNodes.length) {
    parentNode.insertBefore(node.childNodes[0], node);
  }
  parentNode.removeChild(node);

  if (changeSelection) {
    const range = document.createRange();
    range.setStart(parentNode, offset);
    range.setEnd(parentNode, offset);
    replaceSelection(range);
  }
}
