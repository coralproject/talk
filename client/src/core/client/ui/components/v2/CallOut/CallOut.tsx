import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./CallOut.css";

export interface CallOutProps {
  /**
   * The content of the component.
   */
  children: ReactNode;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  /**
   * Color of the CallOut
   */
  color?: "regular" | "primary" | "error" | "success";
  /*
   * If set renders a full width CallOut
   */
  fullWidth?: boolean;

  /*
   * If set removes border
   */
  borderless?: boolean;
}

const CallOut: FunctionComponent<CallOutProps> = (props) => {
  const {
    borderless,
    className,
    classes,
    color,
    fullWidth,
    children,
    ...rest
  } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.colorRegular]: color === "regular",
      [classes.colorError]: color === "error",
      [classes.colorPrimary]: color === "primary",
      [classes.colorSuccess]: color === "success",
      [classes.borderless]: borderless,
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <div className={rootClassName} {...rest}>
      <div className={classes.inner}>{children}</div>
    </div>
  );
};

CallOut.defaultProps = {
  color: "regular",
  fullWidth: false,
} as Partial<CallOutProps>;

const enhanced = withStyles(styles)(CallOut);
export default enhanced;
