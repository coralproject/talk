import React, { FunctionComponent } from "react";

import SpinnerWhileRendering from "./SpinnerWhileRendering";

interface Props {
  children: React.ReactNode;
}

const SpinnerWhileRenderingWrapper: FunctionComponent<Props> = (props) => {
  // In our tests, we don't actually "render", so just skip this.
  if (process.env.NODE_ENV === "test") {
    return <>{props.children}</>;
  }
  return <SpinnerWhileRendering {...props} />;
};

export default SpinnerWhileRenderingWrapper;
