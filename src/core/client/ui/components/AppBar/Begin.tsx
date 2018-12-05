import cn from "classnames";
import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";
import { withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import styles from "./Begin.css";

interface Props extends PropTypesOf<typeof Flex> {
  children?: React.ReactNode;
  className?: string;
  classes: typeof styles;
}

const Begin: StatelessComponent<Props> = ({
  className,
  children,
  classes,
  ...rest
}) => (
  <Flex className={cn(className, classes.root)} alignItems="center" {...rest}>
    {children}
  </Flex>
);

export default withStyles(styles)(Begin);
