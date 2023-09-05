import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./MessageBox.css";

interface Props {
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
}

const MessageBox: FunctionComponent<Props> = (props) => {
  const { className, classes, children, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <div className={rootClassName} {...rest}>
      {children}
    </div>
  );
};

const enhanced = withStyles(styles)(MessageBox);
export default enhanced;
