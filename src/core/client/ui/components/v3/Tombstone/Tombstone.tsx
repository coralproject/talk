import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";

import styles from "./Tombstone.css";

interface Props {
  classes: typeof styles;
  className?: string;
  alignItems?: "center";
  justifyContent?: "center";
  fullWidth?: boolean;
}

const Tombstone: FunctionComponent<Props> = ({
  children,
  alignItems = "center",
  justifyContent = "center",
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

  return (
    <div className={rootClassName}>
      <Flex justifyContent={justifyContent} alignItems={alignItems}>
        {children}
      </Flex>
    </div>
  );
};

const enhanced = withStyles(styles)(Tombstone);

export default enhanced;
