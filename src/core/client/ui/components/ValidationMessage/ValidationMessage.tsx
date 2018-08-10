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
}

const ValidationMessage: StatelessComponent<ValidationMessageProps> = props => {
  const { className, classes, fullWidth, children, ...rest } = props;

  const rootClassName = cn(
    classes.root,
    classes.colorError,
    {
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <div className={rootClassName} {...rest}>
      <Icon size="sm" className={classes.icon}>
        warning
      </Icon>
      {children}
    </div>
  );
};

ValidationMessage.defaultProps = {
  fullWidth: false,
};

const enhanced = withStyles(styles)(ValidationMessage);
export default enhanced;
