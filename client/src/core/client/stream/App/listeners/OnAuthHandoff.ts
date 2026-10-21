import { FunctionComponent, useEffect, useRef } from "react";
import { graphql } from "react-relay";

import isLoggedIn from "coral-framework/helpers/isLoggedIn";
import {
  AUTH_HANDOFF_STARTED,
  waitForAuthHandoff,
} from "coral-framework/lib/auth/handoff";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";
import { SignedInEvent } from "coral-stream/events";

import { OnAuthHandoffLocal } from "coral-stream/__generated__/OnAuthHandoffLocal.graphql";

/**
 * OnAuthHandoff picks up the access token from a sign in popup that lost
 * window.opener (which happens when a sign in page it visited sends
 * `Cross-Origin-Opener-Policy: same-origin`, as bsky.social does), through the
 * server.
 *
 * It does nothing until the popup says it's leaving for a sign in provider,
 * then makes a single request that waits for the token. It lives at the app
 * level so it keeps waiting however the rest of the stream re-renders.
 */
const OnAuthHandoff: FunctionComponent = () => {
  const { rest, postMessage, eventEmitter, relayEnvironment } =
    useCoralContext();
  const setAccessToken = useMutation(SetAccessTokenMutation);
  const [
    {
      authPopup: { handoffID },
    },
  ] = useLocal<OnAuthHandoffLocal>(graphql`
    fragment OnAuthHandoffLocal on Local {
      authPopup {
        handoffID
      }
    }
  `);

  // Keep the latest ID readable from the message listener.
  const currentID = useRef(handoffID);
  currentID.current = handoffID;

  useEffect(() => {
    let stopWaiting: (() => void) | null = null;

    const stopListening = postMessage.on(
      AUTH_HANDOFF_STARTED,
      (id: unknown) => {
        // Only wait for the popup this page opened, never an ID from elsewhere.
        if (typeof id !== "string" || id !== currentID.current) {
          return;
        }
        if (isLoggedIn(relayEnvironment)) {
          return;
        }

        if (stopWaiting) {
          stopWaiting();
        }
        stopWaiting = waitForAuthHandoff(rest, id, (accessToken) => {
          void setAccessToken({ accessToken, refresh: false });
          SignedInEvent.emit(eventEmitter);
        });
      }
    );

    return () => {
      stopListening();
      if (stopWaiting) {
        stopWaiting();
      }
    };
  }, [postMessage, rest, setAccessToken, eventEmitter, relayEnvironment]);

  return null;
};

export default OnAuthHandoff;
