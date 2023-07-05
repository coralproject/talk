import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Divider.css";

interface Props {
  className?: string;
  classes: typeof styles;
}

const Divider: FunctionComponent<Props> = ({ className, classes, ...rest }) => (
  <div {...rest} className={cn(classes.root, className)} />
);

export default withStyles(styles)(Divider);
