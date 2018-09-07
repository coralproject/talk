import cn from "classnames";
import React, { ReactNode, StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

import Icon from "../Icon";
import * as styles from "./Message.css";

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
  * Name of the icon, render if provided
  */
  icon?: string;
  /*
  * Name of color, "info" stays by default - common gray one
  */
  color?: "validation" | "info";
}

const Message: StatelessComponent<MessageProps> = props => {
  const {
    className,
    classes,
    fullWidth,
    children,
    icon,
    color,
    ...rest
  } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.colorInfo]: color === "info",
      [classes.colorValidation]: color === "validation",
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <div className={rootClassName} {...rest}>
      {icon && (
        <Icon size="md" className={classes.icon}>
          {icon}
        </Icon>
      )}
      {children}
    </div>
  );
};

Message.defaultProps = {
  color: "info",
  fullWidth: false,
};

const enhanced = withStyles(styles)(Message);
export default enhanced;
