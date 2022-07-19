import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import TombstoneWrapper from "./TombstoneWrapper";

import styles from "./Tombstone.css";

interface Props {
  classes: typeof styles;
  className?: string;
  fullWidth?: boolean;
  noBottomBorder?: boolean;
  noWrapper?: boolean;
}

const Tombstone: FunctionComponent<Props> = ({
  children,
  fullWidth,
  classes,
  className,
  noBottomBorder,
  noWrapper,
}) => {
  const rootClassName = cn(
    classes.root,
    {
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return noWrapper ? (
    <div className={rootClassName}>{children}</div>
  ) : (
    <TombstoneWrapper noBottomBorder={noBottomBorder}>
      <div className={rootClassName}>{children}</div>
    </TombstoneWrapper>
  );
};

const enhanced = withStyles(styles)(Tombstone);

export default enhanced;
