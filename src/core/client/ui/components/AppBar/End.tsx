import cn from "classnames";
import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";
import { withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import styles from "./End.css";

interface Props extends PropTypesOf<typeof Flex> {
  children?: React.ReactNode;
  className?: string;
  classes: typeof styles;
}

const End: StatelessComponent<Props> = ({
  classes,
  className,
  children,
  ...rest
}) => (
  <Flex className={cn(className, classes.root)} alignItems="center" {...rest}>
    {children}
  </Flex>
);

export default withStyles(styles)(End);
