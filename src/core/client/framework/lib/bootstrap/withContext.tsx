import { createContextHOC } from "talk-framework/helpers";
import { TalkContext, TalkContextConsumer } from "./TalkContext";

const withContext = createContextHOC<TalkContext>(
  "withContext",
  TalkContextConsumer
);

export default withContext;
