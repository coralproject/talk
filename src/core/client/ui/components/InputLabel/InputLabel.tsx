import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import Typography from "../Typography";

import styles from "./InputLabel.css";

export interface InputLabelProps
  extends Omit<PropTypesOf<typeof Typography>, "ref"> {
  id?: string;
  htmlFor?: string;
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

const InputLabelProps: FunctionComponent<InputLabelProps> = (props) => {
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
