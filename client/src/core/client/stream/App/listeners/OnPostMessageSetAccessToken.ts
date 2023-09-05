import { FunctionComponent, useEffect } from "react";

import isLoggedIn from "coral-framework/helpers/isLoggedIn";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation } from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";
import { waitTillAuthPopupIsClosed } from "coral-stream/common/AuthPopup";
import { SignedInEvent } from "coral-stream/events";

const OnPostMessageSetAccessToken: FunctionComponent = () => {
  const { postMessage, eventEmitter, relayEnvironment } = useCoralContext();
  const setAccessToken = useMutation(SetAccessTokenMutation);
  useEffect(() => {
    return postMessage.on("setAccessToken", async (accessToken: string) => {
      await waitTillAuthPopupIsClosed(relayEnvironment);
      const loggedIn = isLoggedIn(relayEnvironment);
      void setAccessToken({ accessToken, refresh: loggedIn });
      if (!loggedIn) {
        SignedInEvent.emit(eventEmitter);
      }
    });
  }, [postMessage, eventEmitter, setAccessToken, relayEnvironment]);
  return null;
};

export default OnPostMessageSetAccessToken;
