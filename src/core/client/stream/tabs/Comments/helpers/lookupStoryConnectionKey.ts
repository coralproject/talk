import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";

import { LOCAL_ID, lookup } from "coral-framework/lib/relay";

export default function lookupStoryConnectionKey(
  environment: RelayModernEnvironment
): string {
  switch (lookup(environment, LOCAL_ID).commentsTab) {
    case "UNANSWERED_COMMENTS":
      return "UnansweredStream_comments";
  }
  return "Stream_comments";
}
