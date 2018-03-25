import createToggle from '../factories/createToggle';
import { findIntersecting } from '../lib/dom';

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
      !italicTags.includes(n.tagName),
    this.container
  );
}

const Italic = createToggle(execCommand, { isActive, isDisabled });

Italic.defaultProps = {
  children: 'Italic',
};

export default Italic;
