import cn from "classnames";
import React, { StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

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
  color?: "grey" | "primary";
}

const Counter: StatelessComponent<Props> = ({
  classes,
  color,
  className,
  children,
  ...rest
}) => {
  const rootClassName = cn(
    classes.root,
    {
      [classes.colorPrimary]: color === "primary",
      [classes.colorGrey]: color === "grey",
    },
    className
  );
  return (
    <span className={rootClassName} {...rest}>
      {children}
    </span>
  );
};

Counter.defaultProps = {
  color: "grey",
};

const enhanced = withStyles(styles)(Counter);
export default enhanced;
