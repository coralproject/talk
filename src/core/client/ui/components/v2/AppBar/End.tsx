import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./End.css";

interface Props extends Omit<PropTypesOf<typeof Flex>, "ref"> {
  children?: React.ReactNode;
  className?: string;
  classes: typeof styles;
}

const End: FunctionComponent<Props> = ({
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
