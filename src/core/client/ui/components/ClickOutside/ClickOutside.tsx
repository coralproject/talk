import React from "react";
import { findDOMNode } from "react-dom";

export interface ClickOutsideProps {
  onClickOutside: () => void;
  children: React.ReactNode;
}

class ClickOutside extends React.Component<ClickOutsideProps> {
  public domNode: Element | null = null;

  public handleClick = (e: MouseEvent) => {
    const { onClickOutside } = this.props;
    if (!e || !this.domNode!.contains(e.target as HTMLInputElement)) {
      // tslint:disable-next-line:no-unused-expression
      onClickOutside && onClickOutside();
    }
  };

  public componentDidMount() {
    this.domNode = findDOMNode(this) as Element;
    document.addEventListener("click", this.handleClick, true);
  }

  public componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, true);
  }

  public render() {
    return this.props.children;
  }
}

export default ClickOutside;
