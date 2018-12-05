import cn from "classnames";
import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";
import { withStyles } from "talk-ui/hocs";

import styles from "./AppBar.css";

interface Props {
  children?: React.ReactNode;
  className?: string;
  gutterBegin?: boolean;
  gutterEnd?: boolean;
  classes: typeof styles;
}

const AppBar: StatelessComponent<Props> = ({
  gutterBegin,
  gutterEnd,
  className,
  children,
  classes,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={cn(classes.root, className, {
        [classes.gutterBegin]: gutterBegin,
        [classes.gutterEnd]: gutterEnd,
      })}
    >
      <Flex className={classes.container}>{children}</Flex>
    </div>
  );
};

export default withStyles(styles)(AppBar);
