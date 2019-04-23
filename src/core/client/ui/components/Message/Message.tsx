import cn from "classnames";
import React, { ReactNode, StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";

import styles from "./Message.css";

export interface MessageProps {
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
  /*
   * If set renders a full width message
   */
  fullWidth?: boolean;
  /*
   * Name of color, "grey" stays by default - common gray one
   */
  color?: "error" | "grey" | "primary" | "dark";
}

const Message: StatelessComponent<MessageProps> = props => {
  const { className, classes, fullWidth, children, color, ...rest } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.colorGrey]: color === "grey",
      [classes.colorError]: color === "error",
      [classes.colorPrimary]: color === "primary",
      [classes.colorDark]: color === "dark",
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

Message.defaultProps = {
  color: "grey",
  fullWidth: false,
};

const enhanced = withStyles(styles)(Message);
export default enhanced;
