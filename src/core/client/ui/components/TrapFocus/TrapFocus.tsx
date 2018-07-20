import React, { RefObject } from "react";

export interface Focusable {
  focus: () => void;
}

interface RenderProps {
  firstFocusableRef: RefObject<Focusable>;
  lastFocusableRef: RefObject<Focusable>;
}

export interface TrapFocusProps {
  children: (props: RenderProps) => React.ReactNode;
}

export default class TrapFocus extends React.Component<TrapFocusProps> {
  private firstFocusableRef = React.createRef<Focusable>();
  private lastFocusableRef = React.createRef<Focusable>();

  // Trap keyboard focus inside the dropdown until a value has been chosen.
  private focusBegin = () => this.firstFocusableRef.current!.focus();
  private focusEnd = () => this.lastFocusableRef.current!.focus();

  public render() {
    return (
      <>
        <div tabIndex={0} onFocus={this.focusEnd} />
        {this.props.children({
          firstFocusableRef: this.firstFocusableRef,
          lastFocusableRef: this.lastFocusableRef,
        })}
        <div tabIndex={0} onFocus={this.focusBegin} />
      </>
    );
  }
}
