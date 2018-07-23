import React from "react";
import { findDOMNode } from "react-dom";

interface Props {
  onClickOutside: () => void;
  children: React.ReactNode;
}

class ClickOutside extends React.Component<Props> {
  public domNode: Element | null = null;

  public handleClick = e => {
    const { onClickOutside } = this.props;
    if (!e || !this.domNode!.contains(e.target)) {
      onClickOutside && onClickOutside(e);
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
