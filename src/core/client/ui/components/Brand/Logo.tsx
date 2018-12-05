import cn from "classnames";
import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";
import { withStyles } from "talk-ui/hocs";

import BrandIcon from "./BrandIcon";
import BrandName from "./BrandName";
import styles from "./Logo.css";

interface Props {
  className?: string;
  classes: typeof styles;
}

const Logo: StatelessComponent<Props> = ({ className, classes, ...rest }) => (
  <Flex {...rest} alignItems="center" className={cn(classes.root, className)}>
    <BrandIcon className={classes.icon} />
    <BrandName />
  </Flex>
);

export default withStyles(styles)(Logo);
