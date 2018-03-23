import { selectionIsInside } from './dom';

export default class API {
  constructor(contentEditable, onChange) {
    this.contentEditable = contentEditable;
    this.broadcastChange = onChange;
  }
  isSelectionInside() {
    return selectionIsInside(this.contentEditable);
  }
  focus() {
    this.contentEditable.focus();
  }
}
