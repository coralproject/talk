import createToggle from '../factories/createToggle';
import {
  findIntersecting,
  insertNewLineAfterNode,
  insertNodes,
  getSelectedNodesExpanded,
  outdentBlock,
  selectEndOfNode,
  indentNodes,
} from '../lib/dom';

function execCommand() {
  const bq = findIntersecting('BLOCKQUOTE', this.container);
  if (bq) {
    outdentBlock(bq, true);
  } else {
    // Expanded selection means we always select whole lines.
    const selectedNodes = getSelectedNodesExpanded();
    if (selectedNodes.length) {
      indentNodes(selectedNodes, 'blockquote', true);
    } else {
      const node = document.createElement('blockquote');
      node.appendChild(document.createElement('br'));
      insertNodes(node);
      selectEndOfNode(node);
    }
  }
  this.broadcastChange();
}

function isActive() {
  return this.focused && !!findIntersecting('BLOCKQUOTE', this.container);
}

function onEnter(node) {
  if (node.tagName !== 'BLOCKQUOTE') {
    return;
  }
  insertNewLineAfterNode(node, true);
  return true;
}

const Blockquote = createToggle(execCommand, { onEnter, isActive });

Blockquote.defaultProps = {
  children: 'Blockquote',
};

export default Blockquote;
