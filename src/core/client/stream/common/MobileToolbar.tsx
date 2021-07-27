import React, { FunctionComponent } from "react";

import { ErrorBoundary } from "coral-framework/components";
import RenderTargetPortal from "coral-stream/renderTarget/RenderTargetPortal";

import styles from "./MobileToolbar.css";

interface Props {
  children: React.ReactNode;
}

const MobileToolbar: FunctionComponent<Props> = (props) => (
  <ErrorBoundary errorContent={null}>
    <RenderTargetPortal target="footer">
      <div className={styles.root}>{props.children}</div>
    </RenderTargetPortal>
  </ErrorBoundary>
);

export default MobileToolbar;
