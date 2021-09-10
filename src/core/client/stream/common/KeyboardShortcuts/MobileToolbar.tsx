import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import CLASSES from "coral-stream/classes";
import RenderTargetPortal from "coral-stream/renderTarget/RenderTargetPortal";
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
  <RenderTargetPortal target="footer">
    <Flex justifyContent="center">
      <div
        className={cn(className, styles.root, CLASSES.mobileToolbar)}
        {...rest}
      >
        {children}
      </div>
    </Flex>
  </RenderTargetPortal>
);

export default MobileToolbar;
