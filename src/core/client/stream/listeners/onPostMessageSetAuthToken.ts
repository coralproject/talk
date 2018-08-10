import { commitLocalUpdate } from "react-relay";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";

export default function onPostMessageSetAuthToken({
  relayEnvironment,
  postMessage,
}: TalkContext) {
  // Auth popup will use this to handle a successful login.
  postMessage!.on("setAuthToken", token => {
    commitLocalUpdate(relayEnvironment, s => {
      s.get(LOCAL_ID)!.setValue(token, "authToken");
    });
  });
}
