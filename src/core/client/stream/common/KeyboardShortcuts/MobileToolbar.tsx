import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { ErrorBoundary } from "coral-framework/components";
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
  <ErrorBoundary errorContent={null}>
    <RenderTargetPortal target="footer">
      <div
        className={cn(className, styles.root, CLASSES.mobileToolbar)}
        {...rest}
      >
        {children}
      </div>
    </RenderTargetPortal>
  </ErrorBoundary>
);

export default MobileToolbar;
