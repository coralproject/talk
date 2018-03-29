/**
 * Simple size limited Undo stack.
 */
export default class Undo {
  /**
   * undoStack contains all known values.
   * The last value of this stack represent
   * the most recent change.
   */
  undoStack = [];
  redoStack = [];
  size;

  constructor(size = 100) {
    this.size = size;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  canUndo() {
    return this.undoStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length;
  }

  undo() {
    if (!this.canUndo()) {
      throw new Error('Nothing to undo');
    }
    const cur = this.undoStack.pop();
    this.redoStack.push(cur);
    return this.undoStack[this.undoStack.length - 1];
  }

  redo() {
    if (!this.canRedo()) {
      throw new Error('Nothing to redo');
    }
    const x = this.redoStack.pop();
    this.undoStack.push(x);
    return x;
  }

  save(x, ...meta) {
    // Ignore if we already have that saved.
    if (
      this.undoStack.length &&
      this.undoStack[this.undoStack.length - 1][0] === x
    ) {
      return;
    }
    this.undoStack.push([x, ...meta]);

    // Adhere to maximum size.
    if (this.undoStack.length > this.size) {
      this.undoStack.splice(0, 1);
    }
    this.redoStack = [];
  }
}
