import cn from "classnames";
import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import BrandIcon from "./BrandIcon";
import BrandName from "./BrandName";
import styles from "./Logo.css";

interface Props {
  className?: string;
}

const Logo: StatelessComponent<Props> = props => (
  <Flex alignItems="center" className={cn(styles.root, props.className)}>
    <BrandIcon className={styles.icon} />
    <BrandName />
  </Flex>
);

export default Logo;
