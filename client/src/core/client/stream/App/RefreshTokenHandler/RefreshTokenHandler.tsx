import { FunctionComponent, useEffect } from "react";
import { graphql } from "react-relay";

import waitFor from "coral-common/helpers/waitFor";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  LOCAL_ID,
  lookup,
  lookupQuery,
  retainQuery,
  useMutation,
} from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";
import { weControlAuth } from "coral-stream/common/authControl";

import { RefreshTokenHandlerAuthControlQuery } from "coral-stream/__generated__/RefreshTokenHandlerAuthControlQuery.graphql";

import {
  ShowAuthPopupMutation,
  waitTillAuthPopupIsClosed,
} from "../../common/AuthPopup";

const authControlQuery = graphql`
  query RefreshTokenHandlerAuthControlQuery {
    settings {
      ...authControl_settings @relay(mask: false)
    }
  }
`;

/**
 * RefreshTokenHandler registers the stream refresh access token
 * logic to `tokenRefreshProvider`.
 */
const RefreshTokenHandler: FunctionComponent = () => {
  const { tokenRefreshProvider, eventEmitter, relayEnvironment } =
    useCoralContext();
  const showAuthPopup = useMutation(ShowAuthPopupMutation);
  const setAccessToken = useMutation(SetAccessTokenMutation);
  useEffect(() => {
    // Prevent garbage collection of auth control data that we use
    // below as long as this component is rendered.
    const retainment = retainQuery<RefreshTokenHandlerAuthControlQuery>(
      relayEnvironment,
      authControlQuery
    );
    return () => {
      retainment.dispose();
    };
  }, [relayEnvironment]);

  useEffect(() => {
    return tokenRefreshProvider.register(async () => {
      // Lookup data that should have been already requested by
      // the UserBoxContainer (with the authControl_settings fragment).
      const data = lookupQuery<RefreshTokenHandlerAuthControlQuery>(
        relayEnvironment,
        authControlQuery
      );

      if (!data?.settings?.auth) {
        throw new Error(
          "Missing auth data. Make sure <UserBoxContainer /> has been rendered."
        );
      }

      if (weControlAuth(data.settings)) {
        // If we control auth, show auth popup to get access token.
        void showAuthPopup({ view: "SIGN_IN" });

        // Wait for auth popup to close.
        await waitTillAuthPopupIsClosed(relayEnvironment);

        // Wait one frame to let other auth popup close routines to start first.
        // See: ./listeners/OnPostMessageSetAccessToken.ts
        await waitFor(0);
      }
      // Return current access token.
      return lookup(relayEnvironment, LOCAL_ID).accessToken;
    });
  }, [
    tokenRefreshProvider,
    showAuthPopup,
    eventEmitter,
    relayEnvironment,
    setAccessToken,
  ]);
  return null;
};

export default RefreshTokenHandler;
