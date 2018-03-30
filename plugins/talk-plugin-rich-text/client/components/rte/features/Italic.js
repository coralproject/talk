import createToggle from '../factories/createToggle';
import { findIntersecting, findAncestor } from '../lib/dom';

const italicTags = ['I', 'EM'];

function execCommand() {
  return document.execCommand('italic');
}
function isActive() {
  return this.focused && document.queryCommandState('italic');
}
function isDisabled() {
  if (!this.focused) {
    return false;
  }
  // Disable whenever the italic styling came from a different
  // tag than those we control.
  return !!findIntersecting(
    n =>
      n.nodeName !== '#text' &&
      window.getComputedStyle(n).getPropertyValue('font-style') === 'italic' &&
      !italicTags.includes(n.tagName) &&
      !findAncestor(n, n => italicTags.includes(n.tagName), this.container),
    this.container
  );
}
function onShortcut(e) {
  if (e.key === 'i') {
    if (!isDisabled.apply(this)) {
      execCommand.apply(this);
    }
    return true;
  }
}

const Italic = createToggle(execCommand, { isActive, isDisabled, onShortcut });

Italic.defaultProps = {
  children: 'Italic',
};

export default Italic;
