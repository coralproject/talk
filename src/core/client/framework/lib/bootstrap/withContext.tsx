import { createContextHOC } from "coral-framework/helpers";
import { CoralContext, CoralContextConsumer } from "./CoralContext";

const withContext = createContextHOC<CoralContext>(
  "withContext",
  CoralContextConsumer
);

export default withContext;
