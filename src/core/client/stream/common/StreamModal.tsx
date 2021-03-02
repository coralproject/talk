import React, { FunctionComponent } from "react";

import { ErrorBoundary } from "coral-framework/components";
import { PropTypesOf } from "coral-framework/types";
import RenderTargetPortal from "coral-stream/renderTarget/RenderTargetPortal";
import { Modal } from "coral-ui/components/v2";

type Props = Omit<PropTypesOf<typeof Modal>, "ref" | "PortalElement">;

const StreamModal: FunctionComponent<Props> = (props) => (
  <ErrorBoundary errorContent={null}>
    <Modal {...props} PortalElement={<RenderTargetPortal target="modal" />}>
      {props.children}
    </Modal>
  </ErrorBoundary>
);

export default StreamModal;
