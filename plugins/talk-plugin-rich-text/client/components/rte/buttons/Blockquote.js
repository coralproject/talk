import createToggle from '../factories/createToggle';
import {
  findIntersectingTag,
  insertNewLineAfterNode,
  replaceSelection,
  insertNodes,
  getSelectedNodesExpanded,
  outdentNode,
} from '../lib/dom';

// TODO: select end of node.
function selectNode(node) {
  const range = document.createRange();
  const container = node.childNodes.length ? node.childNodes[0] : node;
  range.setStart(container, 0);
  range.setEnd(container, 0);
  replaceSelection(range);
}

function execCommand() {
  const bq = findIntersectingTag('BLOCKQUOTE');
  if (bq) {
    outdentNode(bq, true);
  } else {
    const node = document.createElement('blockquote');
    const selectedNodes = getSelectedNodesExpanded();
    if (selectedNodes.length) {
      const firstNode = selectedNodes[0];
      firstNode.parentNode.insertBefore(node, firstNode);
      selectedNodes.forEach(n => {
        node.appendChild(n);
      });
      selectNode(node);
    } else {
      node.appendChild(document.createElement('br'));
      insertNodes(node);
      selectNode(node);
    }
  }
  this.broadcastChange();
}

function isActive() {
  return !!findIntersectingTag('BLOCKQUOTE');
}

const onEnter = node => {
  if (node.tagName !== 'BLOCKQUOTE') {
    return;
  }
  insertNewLineAfterNode(node, true);
  return true;
};

const Blockquote = createToggle(execCommand, { onEnter, isActive });

Blockquote.defaultProps = {
  children: 'Blockquote',
};

export default Blockquote;
