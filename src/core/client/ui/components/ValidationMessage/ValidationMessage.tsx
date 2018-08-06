import cn from "classnames";
import React from "react";
import { ReactNode, StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import Icon from "../Icon";
import * as styles from "./ValidationMessage.css";

export interface ValidationMessageProps {
  /**
   * The content of the component.
   */
  children: string | ReactNode;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  /**
   * Color of the ValidationMessage
   */
  color?: "regular" | "error";
  /*
  * If set renders a full width message
  */
  fullWidth?: boolean;
}

const ValidationMessage: StatelessComponent<ValidationMessageProps> = props => {
  const { className, classes, color, fullWidth, children, ...rest } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.colorRegular]: color === "regular",
      [classes.colorError]: color === "error",
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <div className={rootClassName} {...rest}>
      {color === "error" && (
        <Icon size="sm" className={classes.icon}>
          warning
        </Icon>
      )}
      {children}
    </div>
  );
};

ValidationMessage.defaultProps = {
  color: "regular",
  fullWidth: false,
};

const enhanced = withStyles(styles)(ValidationMessage);
export default enhanced;
