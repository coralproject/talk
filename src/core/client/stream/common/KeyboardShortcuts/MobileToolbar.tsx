import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";

import styles from "./MobileToolbar.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MobileToolbar: FunctionComponent<Props> = ({
  children,
  className,
  ...rest
}) => (
  <Flex justifyContent="center">
    <div
      className={cn(className, styles.root, CLASSES.mobileToolbar)}
      {...rest}
    >
      {children}
    </div>
  </Flex>
);

export default MobileToolbar;
