import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Marker.css";

interface Props {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  children: React.ReactNode;
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color?: "reported" | "pending" | "warning";

  variant?: "regular" | "filled";
}

const Marker: FunctionComponent<Props> = (props) => {
  const { className, children, classes, color, variant, ...rest } = props;

  const rootClassName = cn(classes.root, className, {
    [classes.colorReported]: color === "reported",
    [classes.colorPending]: color === "pending",
    [classes.colorWarning]: color === "warning",
    [classes.variantRegular]: variant === "regular",
    [classes.variantFilled]: variant === "filled",
  });

  return (
    <span className={rootClassName} {...rest}>
      {children}
    </span>
  );
};

Marker.defaultProps = {
  color: "pending",
  variant: "regular",
};

const enhanced = withStyles(styles)(Marker);
export default enhanced;
