import cn from "classnames";
import React from "react";
import { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Tag.css";

interface Props {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  children: React.ReactNode;
  color?: "grey" | "primary" | "error";

  variant?: "regular" | "pill";
}

const Tag: FunctionComponent<Props> = props => {
  const { className, children, classes, variant, color, ...rest } = props;

  const rootClassName = cn(classes.root, className, {
    [classes.variantPill]: variant === "pill",
    [classes.colorPrimary]: color === "primary",
    [classes.colorError]: color === "error",
    [classes.colorGrey]: color === "grey",
  });

  return (
    <span className={rootClassName} {...rest}>
      {children}
    </span>
  );
};

Tag.defaultProps = {
  color: "grey",
  variant: "regular",
};

const enhanced = withStyles(styles)(Tag);
export default enhanced;
