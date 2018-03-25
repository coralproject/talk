import { isSelectionInside } from './dom';

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
      this.container.focus();
    },
    isSelectionInside() {
      return isSelectionInside(getContainer());
    },
  };
}

export default createAPI;
