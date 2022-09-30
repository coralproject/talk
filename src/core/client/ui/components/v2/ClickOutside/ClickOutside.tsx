import React, { FunctionComponent } from "react";

import UIContext from "../UIContext";

export interface ClickOutsideProps {
  onClickOutside: (e?: MouseEvent) => void;

  /**
   * Allow you to change the `Window` reference.
   */
  window?: Window;

  children: React.ReactNode;
}

export class ClickOutside extends React.Component<ClickOutsideProps> {
  public static defaultProps: Partial<ClickOutsideProps> = {
    // eslint-disable-next-line no-restricted-globals
    window,
  };

  public domNode: Element | null = null;

  public handleRef = (e: Element | null) => {
    this.domNode = e;
  };

  public handleClick = (e: MouseEvent) => {
    const path =
      (e.composedPath && e.composedPath()) ||
      // Supports older browsers.
      (e as any).path;
    const { onClickOutside } = this.props;
    if (this.domNode && !this.domNode.contains(path[0] as HTMLInputElement)) {
      // eslint-disable-next-line no-unused-expressions
      onClickOutside && onClickOutside(e);
    }
  };

  public componentDidMount() {
    this.props.window!.document.addEventListener(
      "click",
      this.handleClick,
      true
    );
  }

  public componentWillUnmount() {
    this.props.window!.document.removeEventListener(
      "click",
      this.handleClick,
      true
    );
  }

  public render() {
    return (
      <div ref={(node) => (this.domNode = node)}>{this.props.children}</div>
    );
  }
}

const ClickOutsideWithContext: FunctionComponent<ClickOutsideProps> = (
  props
) => (
  <UIContext.Consumer>
    {({ renderWindow }) => <ClickOutside {...props} window={renderWindow} />}
  </UIContext.Consumer>
);

export default ClickOutsideWithContext;
