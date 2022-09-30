import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import TombstoneWrapper from "./TombstoneWrapper";

import styles from "./Tombstone.css";

interface Props {
  classes: typeof styles;
  id: string;
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
  noBottomBorder?: boolean;
  noWrapper?: boolean;
}

const Tombstone: FunctionComponent<Props> = ({
  children,
  fullWidth,
  classes,
  id,
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
    <div className={rootClassName} id={id}>
      {children}
    </div>
  ) : (
    <TombstoneWrapper noBottomBorder={noBottomBorder}>
      <div className={rootClassName} id={id}>
        {children}
      </div>
    </TombstoneWrapper>
  );
};

const enhanced = withStyles(styles)(Tombstone);

export default enhanced;
