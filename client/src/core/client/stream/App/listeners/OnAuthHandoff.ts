import { FunctionComponent, useEffect } from "react";
import { graphql } from "react-relay";

import isLoggedIn from "coral-framework/helpers/isLoggedIn";
import { pollForAuthHandoff } from "coral-framework/lib/auth/handoff";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";
import { SignedInEvent } from "coral-stream/events";

import { OnAuthHandoffLocal } from "coral-stream/__generated__/OnAuthHandoffLocal.graphql";

/**
 * OnAuthHandoff picks up the access token from a sign in popup that lost
 * window.opener (which happens when a sign in page it visited sends
 * `Cross-Origin-Opener-Policy: same-origin`, as bsky.social does), through the
 * server. It lives at the app level so it keeps polling however the rest of
 * the stream re-renders while the user signs in.
 */
const OnAuthHandoff: FunctionComponent = () => {
  const { rest, eventEmitter, relayEnvironment } = useCoralContext();
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

  useEffect(() => {
    if (!handoffID || isLoggedIn(relayEnvironment)) {
      return;
    }

    return pollForAuthHandoff(
      rest,
      handoffID,
      (accessToken) => {
        void setAccessToken({ accessToken, refresh: false });
        SignedInEvent.emit(eventEmitter);
      },
      // The token arrived the usual way, through window.opener.
      () => isLoggedIn(relayEnvironment)
    );
  }, [handoffID, rest, setAccessToken, eventEmitter, relayEnvironment]);

  return null;
};

export default OnAuthHandoff;
