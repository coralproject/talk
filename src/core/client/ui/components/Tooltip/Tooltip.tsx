import cn from "classnames";
import React from "react";
import ReactTooltip from "react-tooltip";
import * as styles from "./Tooltip.css";

interface InnerProps extends ReactTooltip.Props {
  clickable: boolean;
}

class Tooltip extends React.Component<InnerProps> {
  public render() {
    const { clickable } = this.props;
    return (
      <ReactTooltip
        className={cn(styles.root, { [styles.clickable]: clickable })}
        {...this.props}
      />
    );
  }
}

export default Tooltip;
