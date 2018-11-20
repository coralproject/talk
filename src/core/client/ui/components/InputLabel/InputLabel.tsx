import cn from "classnames";
import React, { ReactNode } from "react";
import { StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import Typography from "../Typography";
import styles from "./InputLabel.css";

export interface InputLabelProps {
  /**
   * The content of the component.
   */
  children?: ReactNode;
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
    <Typography className={rootClassName} variant="inputLabel" {...rest}>
      {children}
    </Typography>
  );
};

const enhanced = withStyles(styles)(InputLabelProps);
export default enhanced;
