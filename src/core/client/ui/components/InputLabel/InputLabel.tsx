import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import Typography from "../Typography";
import * as styles from "./InputLabel.css";

export interface InputLabelProps {
  /**
   * The content of the component.
   */
  children?: string;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const InputLabelProps: StatelessComponent<InputLabelProps> = props => {
  const { className, children, classes, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <Typography className={rootClassName} {...rest}>
      {children}
    </Typography>
  );
};

const enhanced = withStyles(styles)(InputLabelProps);
export default enhanced;
