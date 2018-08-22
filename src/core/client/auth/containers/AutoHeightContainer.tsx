import { Component } from "react";

/**
 * A container that adapts the window height to the current body size
 * when this is mounted or updated.
 */
export default class AutoHeightContainer extends Component {
  private timeout: any = null;

  private updateWindowSizeCallback = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const innerHeight = window.document.body.offsetHeight;
      window.resizeTo(
        window.outerWidth,
        innerHeight + window.outerHeight - window.innerHeight
      );
    }, 0);
  };

  private updateWindowSize() {
    window.requestAnimationFrame(this.updateWindowSizeCallback);
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
