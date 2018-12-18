import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

import styles from "./Count.css";

interface Props {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  children: React.ReactNode;
}

const Count: StatelessComponent<Props> = props => {
  const { className, children, classes, ...rest } = props;
  const rootClassName = cn(classes.root, className);

  return (
    <span className={rootClassName} {...rest}>
      {children}
    </span>
  );
};

const enhanced = withStyles(styles)(Count);
export default enhanced;
