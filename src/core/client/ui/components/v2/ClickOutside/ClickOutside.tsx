import React, { FunctionComponent } from "react";
import { findDOMNode } from "react-dom";

import UIContext from "../UIContext";

export type ClickFarAwayCallback = () => void;
export type ClickFarAwayUnlistenCallback = () => void;

export type ClickFarAwayRegister = (
  callback: ClickFarAwayCallback
) => ClickFarAwayUnlistenCallback;

export interface ClickOutsideProps {
  onClickOutside: (e?: MouseEvent) => void;

  /**
   * A way to listen for clicks that are e.g. outside of the
   * current frame for `ClickOutside`
   */
  registerClickFarAway?: ClickFarAwayRegister;

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
  private unlisten?: ClickFarAwayUnlistenCallback;

  public handleClick = (e: MouseEvent) => {
    const { onClickOutside } = this.props;
    if (!e || !this.domNode!.contains(e.target as HTMLInputElement)) {
      // eslint-disable-next-line no-unused-expressions
      onClickOutside && onClickOutside(e);
    }
  };

  public handleClickFarAway = () => {
    const { onClickOutside } = this.props;
    // eslint-disable-next-line no-unused-expressions
    onClickOutside && onClickOutside();
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

    // Listen to far away clicks.
    if (this.props.registerClickFarAway) {
      this.unlisten = this.props.registerClickFarAway(this.handleClickFarAway);
    }
  }

  public componentWillUnmount() {
    this.props.window!.document.removeEventListener(
      "click",
      this.handleClick,
      true
    );

    // Unlisten to far away clicks.
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = undefined;
    }
  }

  public render() {
    return this.props.children;
  }
}

const ClickOutsideWithContext: FunctionComponent<ClickOutsideProps> = (
  props
) => (
  <UIContext.Consumer>
    {({ registerClickFarAway, renderWindow }) => (
      <ClickOutside
        {...props}
        registerClickFarAway={registerClickFarAway}
        window={renderWindow}
      />
    )}
  </UIContext.Consumer>
);

export default ClickOutsideWithContext;
