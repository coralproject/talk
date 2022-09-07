import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Tombstone.css";

interface Props {
  classes: typeof styles;
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Tombstone: FunctionComponent<Props> = ({
  children,
  fullWidth,
  classes,
  className,
}) => {
  const rootClassName = cn(
    classes.root,
    {
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return <div className={rootClassName}>{children}</div>;
};

const enhanced = withStyles(styles)(Tombstone);

export default enhanced;
