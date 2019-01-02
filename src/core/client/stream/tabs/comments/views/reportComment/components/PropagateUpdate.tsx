import { Component } from "react";

interface Props {
  onUpdate: () => void;
}

/**
 * A component that calls onUpdate, after componentDidMount and
 * componentDidUpdate.
 */
export default class PropagateUpdate extends Component<Props> {
  public componentDidUpdate() {
    this.props.onUpdate();
  }

  public render() {
    return null;
  }
}
