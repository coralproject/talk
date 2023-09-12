import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Navigation.css";

interface Props extends HTMLAttributes<any> {
  className?: string;
  classes: typeof styles;
  children?: React.ReactNode;
}

const Navigation: FunctionComponent<Props> = ({
  children,
  className,
  classes,
  ...rest
}) => (
  <nav {...rest} className={cn(classes.root, className)}>
    <ul className={classes.ul}>{children}</ul>
  </nav>
);

export default withStyles(styles)(Navigation);
