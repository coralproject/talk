import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./InputLabel.css";

export interface InputLabelProps {
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
    <div className={rootClassName} {...rest}>
      {children}
    </div>
  );
};

const enhanced = withStyles(styles)(InputLabelProps);
export default enhanced;
