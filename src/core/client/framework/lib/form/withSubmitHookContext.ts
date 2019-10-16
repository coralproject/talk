import { createContextHOC } from "coral-framework/helpers";

import {
  SubmitHookContext,
  SubmitHookContextConsumer,
} from "./SubmitHookContext";

const withSubmitHookContext = createContextHOC<SubmitHookContext>(
  "withSubmitHookContext",
  SubmitHookContextConsumer
);

export default withSubmitHookContext;
