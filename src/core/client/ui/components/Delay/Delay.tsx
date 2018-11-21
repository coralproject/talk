import React from "react";
import { Component } from "react";

interface Props {
  ms?: number;
  children: React.ReactNode;
}

interface State {
  render: boolean;
}

export class Delay extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    ms: 500,
  };
  private timeout: any;
  public state = {
    render: false,
  };
  constructor(props: Props) {
    super(props);
    this.timeout = setTimeout(() => {
      this.setState({ render: true });
    }, props.ms);
  }
  public componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  public render() {
    if (!this.state.render) {
      return null;
    }
    return <>{this.props.children}</>;
  }
}

export default Delay;
