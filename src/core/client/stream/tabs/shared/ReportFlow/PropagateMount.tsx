import { Component } from "react";

interface Props {
  onMount: () => void;
}

/**
 * A component that calls onMount, after componentDidMount.
 */
export default class PropagateUpdate extends Component<Props> {
  public componentDidMount() {
    this.props.onMount();
  }

  public render() {
    return null;
  }
}
