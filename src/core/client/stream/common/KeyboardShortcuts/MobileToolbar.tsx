import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import ReactShadowRoot from "coral-framework/lib/encapsulation/ReactShadowRoot";
import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import Portal from "coral-ui/components/v2/Modal/Portal";

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
    <ReactShadowRoot modal>
      <Flex justifyContent="center" className={cn(className, styles.root)}>
        <div className={cn(styles.bar, CLASSES.mobileToolbar)} {...rest}>
          {children}
        </div>
      </Flex>
    </ReactShadowRoot>
  </Portal>
);

export default MobileToolbar;
