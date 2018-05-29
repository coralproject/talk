import { isSelectionInside, selectEndOfNode } from '../lib/dom';

/**
 * An instance of API is passed to all the buttons to
 * interact with RTE, which servers as a clean abstraction.
 */
function createAPI(
  getContainer,
  broadcastChange,
  canUndo,
  canRedo,
  undo,
  redo,
  getFocused
) {
  return {
    broadcastChange,
    canUndo,
    canRedo,
    undo,
    redo,
    get focused() {
      return getFocused();
    },
    get container() {
      return getContainer();
    },
    focus() {
      // IOS workaround inspired by https://github.com/facebook/draft-js/issues/1075#issuecomment-369700275.
      // Putting the selection inside the contentEditable before calling `focus`
      // prevents an undesired scroll jump.
      if (!isSelectionInside(this.container)) {
        if (this.container.childNodes.length === 0) {
          this.container.appendChild(document.createTextNode(''));
        }
        selectEndOfNode(this.container);
      }
      this.container.focus();
    },
    isSelectionInside() {
      return isSelectionInside(getContainer());
    },
  };
}

export default createAPI;
