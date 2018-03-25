/**
 * An instance of API is passed to all the buttons to
 * interact with RTE, which servers as a clean abstraction.
 */
export default class API {
  constructor(container, onChange, canUndo, canRedo, undo, redo) {
    this.container = container;
    this.broadcastChange = onChange;
    this.canUndo = canUndo;
    this.canRedo = canRedo;
    this.undo = undo;
    this.redo = redo;
  }
  focus() {
    this.container.focus();
  }
}
