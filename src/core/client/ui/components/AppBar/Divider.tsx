import cn from "classnames";
import React, { StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";
import styles from "./Divider.css";

interface Props {
  className?: string;
  classes: typeof styles;
}

const Divider: StatelessComponent<Props> = ({
  className,
  classes,
  ...rest
}) => <div {...rest} className={cn(classes.root, className)} />;

export default withStyles(styles)(Divider);
