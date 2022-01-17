import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import Portal from "coral-ui/components/v2/Modal/Portal";
import { ReactShadowRootDerived } from "coral-ui/shadow/ReactShadowRoot";

import styles from "./MobileToolbar.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MobileToolbar: FunctionComponent<Props> = ({
  children,
  className,
  ...rest
}) => (
  <Portal>
    <ReactShadowRootDerived>
      <Flex justifyContent="center" className={cn(className, styles.root)}>
        <div className={cn(styles.bar, CLASSES.mobileToolbar)} {...rest}>
          {children}
        </div>
      </Flex>
    </ReactShadowRootDerived>
  </Portal>
);

export default MobileToolbar;
