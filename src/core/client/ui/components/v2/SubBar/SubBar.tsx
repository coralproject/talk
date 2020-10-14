import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { Flex } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";

import styles from "./SubBar.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  gutterBegin?: boolean;
  gutterEnd?: boolean;
  classes: typeof styles;
}

const SubBar: FunctionComponent<Props> = ({
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
      <Flex
        className={classes.container}
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Flex>
    </div>
  );
};

export default withStyles(styles)(SubBar);
