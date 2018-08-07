import React, { StatelessComponent } from "react";
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

  children: React.ReactNode;
}

export class ClickOutside extends React.Component<ClickOutsideProps> {
  public domNode: Element | null = null;
  private unlisten?: ClickFarAwayUnlistenCallback;

  public handleClick = (e: MouseEvent) => {
    const { onClickOutside } = this.props;
    if (!e || !this.domNode!.contains(e.target as HTMLInputElement)) {
      // tslint:disable-next-line:no-unused-expression
      onClickOutside && onClickOutside(e);
    }
  };

  public handleClickFarAway = () => {
    const { onClickOutside } = this.props;
    // tslint:disable-next-line:no-unused-expression
    onClickOutside && onClickOutside();
  };

  public componentDidMount() {
    this.domNode = findDOMNode(this) as Element;
    document.addEventListener("click", this.handleClick, true);

    // Listen to far away clicks.
    if (this.props.registerClickFarAway) {
      this.unlisten = this.props.registerClickFarAway(this.handleClickFarAway);
    }
  }

  public componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, true);

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

const ClickOutsideWithContext: StatelessComponent<
  ClickOutsideProps
> = props => (
  <UIContext.Consumer>
    {({ registerClickFarAway }) => (
      <ClickOutside {...props} registerClickFarAway={registerClickFarAway} />
    )}
  </UIContext.Consumer>
);

export default ClickOutsideWithContext;
