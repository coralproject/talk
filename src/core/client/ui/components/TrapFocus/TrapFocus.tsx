import React from "react";

export interface Focusable {
  focus: () => void;
}

interface TrapFocusProps {
  firstFocusable: Focusable | null;
  lastFocusable: Focusable | null;
  children: React.ReactNode;
}

export default class TrapFocus extends React.Component<TrapFocusProps> {
  // Trap keyboard focus inside the dropdown until a value has been chosen.
  public focusBegin = () => this.props.firstFocusable!.focus();
  public focusEnd = () => this.props.lastFocusable!.focus();

  public render() {
    return (
      <>
        <div tabIndex={0} onFocus={this.focusEnd} />
        {this.props.children}
        <div tabIndex={0} onFocus={this.focusBegin} />
      </>
    );
  }
}
