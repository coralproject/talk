import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Counter.css";

interface Props {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color?:
    | "inherit"
    | "dark"
    | "grey"
    | "primary"
    | "error"
    | "default"
    | "emphasis"
    | "alert";

  size?: "sm" | "md";
  children?: React.ReactNode;
}

const Counter: FunctionComponent<Props> = ({
  classes,
  color,
  className,
  children,
  size,
  ...rest
}) => {
  const rootClassName = cn(
    classes.root,
    {
      [classes.colorPrimary]: color === "primary",
      [classes.colorDark]: color === "dark",
      [classes.colorGrey]: color === "grey",
      [classes.colorInherit]: color === "inherit",
      [classes.colorError]: color === "error",
      [classes.colorDefault]: color === "default",
      [classes.colorEmphasis]: color === "emphasis",
      [classes.colorAlert]: color === "alert",
      [classes.sizeSmall]: size === "sm",
    },
    className
  );
  return (
    <span className={rootClassName} {...rest}>
      <span className={classes.text}>{children}</span>
    </span>
  );
};

Counter.defaultProps = {
  color: "inherit",
};

const enhanced = withStyles(styles)(Counter);
export default enhanced;
