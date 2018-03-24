import createToggle from '../factories/createToggle';
import {
  findIntersectingTag,
  insertNewLineAfterNode,
  insertNodes,
  getSelectedNodesExpanded,
  outdentNode,
  selectEndOfNode,
} from '../lib/dom';

function execCommand() {
  const bq = findIntersectingTag('BLOCKQUOTE');
  if (bq) {
    outdentNode(bq, true);
  } else {
    const node = document.createElement('blockquote');

    // Expanded selection means we always select whole lines.
    const selectedNodes = getSelectedNodesExpanded();
    if (selectedNodes.length) {
      const firstNode = selectedNodes[0];
      firstNode.parentNode.insertBefore(node, firstNode);
      selectedNodes.forEach(n => {
        node.appendChild(n);
      });
      selectEndOfNode(node);
    } else {
      node.appendChild(document.createElement('br'));
      insertNodes(node);
      selectEndOfNode(node);
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
