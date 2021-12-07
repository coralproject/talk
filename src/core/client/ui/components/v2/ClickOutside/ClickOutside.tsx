import React, { FunctionComponent } from "react";
import { findDOMNode } from "react-dom";

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

  public handleClick = (e: MouseEvent) => {
    const { onClickOutside } = this.props;
    if (!e || !this.domNode!.contains(e.target as HTMLInputElement)) {
      // eslint-disable-next-line no-unused-expressions
      onClickOutside && onClickOutside(e);
    }
  };

  public componentDidMount() {
    // TODO: find another solution to `findDOMNode`.
    // eslint-disable-next-line react/no-find-dom-node
    this.domNode = findDOMNode(this) as Element;
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
    return this.props.children;
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
