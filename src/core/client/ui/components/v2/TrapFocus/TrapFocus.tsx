/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { RefObject } from "react";
import withUIContext from "../UIContext/withUIContext";

interface RenderProps {
  firstFocusableRef: RefObject<any>;
  lastFocusableRef: RefObject<any>;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactNode;

interface TrapFocusProps {
  window: Window;
  children?: React.ReactNode | RenderPropsCallback;
}

function isRenderProp(
  children: TrapFocusProps["children"]
): children is RenderPropsCallback {
  return typeof children === "function";
}

export class TrapFocus extends React.Component<TrapFocusProps> {
  private fallbackRef = React.createRef<any>();
  private firstFocusableRef = React.createRef<any>();
  private lastFocusableRef = React.createRef<any>();
  private previousActiveElement: any | null;

  // Trap keyboard focus inside the dropdown until a value has been chosen.
  private focusBegin = () =>
    (this.firstFocusableRef.current || this.fallbackRef.current).focus();
  private focusEnd = () =>
    (this.lastFocusableRef.current || this.fallbackRef.current).focus();

  public componentDidMount() {
    this.previousActiveElement = this.props.window.document.activeElement;
    this.fallbackRef.current.focus();
  }

  public componentWillUnmount() {
    if (this.previousActiveElement && this.previousActiveElement.focus) {
      this.previousActiveElement.focus();
    }
  }

  public render() {
    return (
      <>
        <div tabIndex={0} onFocus={this.focusEnd} />
        <div tabIndex={-1} ref={this.fallbackRef} />
        {isRenderProp(this.props.children)
          ? this.props.children({
              firstFocusableRef: this.firstFocusableRef,
              lastFocusableRef: this.lastFocusableRef,
            })
          : this.props.children}
        <div tabIndex={0} onFocus={this.focusBegin} />
      </>
    );
  }
}

const enhanced = withUIContext(({ renderWindow }) => ({
  window: renderWindow,
}))(TrapFocus);
export default enhanced;
