import cn from "classnames";
import React from "react";
import { ReactNode, StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

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
  color?: "regular" | "primary" | "error";
  /*
   * If set renders a full width CallOut
   */
  fullWidth?: boolean;
}

const CallOut: StatelessComponent<CallOutProps> = props => {
  const { className, classes, color, fullWidth, children, ...rest } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.colorRegular]: color === "regular",
      [classes.colorError]: color === "error",
      [classes.colorPrimary]: color === "primary",
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <div className={rootClassName} {...rest}>
      {children}
    </div>
  );
};

CallOut.defaultProps = {
  color: "regular",
  fullWidth: false,
} as Partial<CallOutProps>;

const enhanced = withStyles(styles)(CallOut);
export default enhanced;
