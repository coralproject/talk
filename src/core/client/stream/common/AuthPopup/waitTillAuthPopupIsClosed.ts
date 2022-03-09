import { waitForLocalState } from "coral-framework/lib/relay";
import { waitTillAuthPopupIsClosedLocal } from "coral-stream/__generated__/waitTillAuthPopupIsClosedLocal.graphql";
import { graphql } from "react-relay";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";

async function waitTillAuthPopupIsClosed(environment: RelayModernEnvironment) {
  // Wait for auth popup to close.
  await waitForLocalState<waitTillAuthPopupIsClosedLocal>(
    environment,
    graphql`
      fragment waitTillAuthPopupIsClosedLocal on Local {
        authPopup {
          open
        }
      }
    `,
    (data) => data.authPopup.open === false
  );
}

export default waitTillAuthPopupIsClosed;
