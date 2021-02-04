import createContextHOC from "coral-framework/helpers/createContextHOC";

import UIContext, { UIContextProps } from "./UIContext";

const withUIContext = createContextHOC<UIContextProps>(
  "withUIContext",
  UIContext.Consumer
);

export default withUIContext;
