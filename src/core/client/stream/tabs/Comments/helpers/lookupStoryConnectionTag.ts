import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";

import { LOCAL_ID, lookup } from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";

export default function lookupStoryConnectionTag(
  environment: RelayModernEnvironment
): string | undefined {
  switch (lookup(environment, LOCAL_ID).commentsTab) {
    case "REVIEWS":
      return GQLTAG.REVIEW;
    case "QUESTIONS":
      return GQLTAG.QUESTION;
    case "UNANSWERED_COMMENTS":
      return GQLTAG.UNANSWERED;
  }
  return undefined;
}
