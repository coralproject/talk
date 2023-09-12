import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./ListGroup.css";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const ListGroup: FunctionComponent<Props> = ({ className, children }) => {
  return (
    <Flex direction="column" className={cn(styles.root, className)}>
      {children}
    </Flex>
  );
};

export default ListGroup;
