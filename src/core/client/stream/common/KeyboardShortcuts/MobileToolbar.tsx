import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import CLASSES from "coral-stream/classes";
import RenderTargetPortal from "coral-stream/renderTarget/RenderTargetPortal";

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
    <div
      className={cn(className, styles.root, CLASSES.mobileToolbar)}
      {...rest}
    >
      {children}
    </div>
  </RenderTargetPortal>
);

export default MobileToolbar;
