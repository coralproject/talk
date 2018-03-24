import { selectionIsInside } from './dom';

/**
 * An instance of API is passed to all the buttons to
 * interact with RTE, which servers as a clean abstraction.
 */
export default class API {
  constructor(contentEditable, onChange, canUndo, canRedo, undo, redo) {
    this.contentEditable = contentEditable;
    this.broadcastChange = onChange;
    this.canUndo = canUndo;
    this.canRedo = canRedo;
    this.undo = undo;
    this.redo = redo;
  }
  isSelectionInside() {
    return selectionIsInside(this.contentEditable);
  }
  focus() {
    this.contentEditable.focus();
  }
}
