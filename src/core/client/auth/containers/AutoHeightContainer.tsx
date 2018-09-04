import { Component } from "react";

import resizePopup from "../dom/resizePopup";

/**
 * A container that adapts the window height to the current body size
 * when this is mounted or updated.
 */
export default class AutoHeightContainer extends Component {
  private updateWindowSize() {
    window.requestAnimationFrame(() => setTimeout(resizePopup, 0));
  }

  public componentDidMount() {
    this.updateWindowSize();
  }

  public componentDidUpdate() {
    this.updateWindowSize();
  }

  public render() {
    return null;
  }
}
