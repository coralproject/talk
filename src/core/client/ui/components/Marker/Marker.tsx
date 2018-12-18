import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

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
  color?: "grey" | "primary" | "error";

  variant?: "regular" | "filled";
}

const Marker: StatelessComponent<Props> = props => {
  const { className, children, classes, color, variant, ...rest } = props;

  const rootClassName = cn(classes.root, className, {
    [classes.colorPrimary]: color === "primary",
    [classes.colorGrey]: color === "grey",
    [classes.colorError]: color === "error",
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
  color: "grey",
  variant: "regular",
};

const enhanced = withStyles(styles)(Marker);
export default enhanced;
