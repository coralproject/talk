import React from "react";

import App from "coral-admin/App";
import { render } from "@testing-library/react";
import {
  CoralContext,
  CoralContextProvider,
} from "coral-framework/lib/bootstrap";

export default function customRenderAppWithContext(context: CoralContext) {
  render(
    <CoralContextProvider value={context}>
      <App />
    </CoralContextProvider>
  );
}
