import createToggle from '../factories/createToggle';
import { findIntersecting, findAncestor } from '../lib/dom';

const boldTags = ['B', 'STRONG'];

function execCommand() {
  return document.execCommand('bold');
}

function isActive() {
  return this.focused && document.queryCommandState('bold');
}
function isDisabled() {
  if (!this.focused) {
    return false;
  }

  // Disable whenever the bold styling came from a different
  // tag than those we control.
  return !!findIntersecting(
    n =>
      n.nodeName !== '#text' &&
      window.getComputedStyle(n).getPropertyValue('font-weight') === 'bold' &&
      !boldTags.includes(n.tagName) &&
      !findAncestor(n, n => boldTags.includes(n.tagName), this.container),
    this.container
  );
}
function onShortcut(e) {
  if (e.key === 'b') {
    if (!isDisabled.apply(this)) {
      execCommand.apply(this);
    }
    return true;
  }
}

const Bold = createToggle(execCommand, { isActive, isDisabled, onShortcut });

Bold.defaultProps = {
  children: 'Bold',
};

export default Bold;
