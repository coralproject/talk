import { Component } from "react";

import resizePopup from "../dom/resizePopup";

/**
 * This component adapts the window height to the current body size
 * when this is mounted or updated.
 */
export default class AutoHeight extends Component {
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
