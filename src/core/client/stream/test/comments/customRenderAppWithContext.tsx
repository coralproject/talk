import { render } from "@testing-library/react";
import React from "react";

import {
  CoralContext,
  CoralContextProvider,
} from "coral-framework/lib/bootstrap";
import App from "coral-stream/App";

export default function customRenderAppWithContext(context: CoralContext) {
  render(
    <CoralContextProvider value={context}>
      <App />
    </CoralContextProvider>
  );
}
