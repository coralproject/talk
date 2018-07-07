import React from "react";
import ReactTooltip from "react-tooltip";
import * as styles from "./Tooltip.css";

class Tooltip extends React.Component<ReactTooltip.Props> {
  public render() {
    return <ReactTooltip className={styles.root} {...this.props} />;
  }
}

export default Tooltip;
