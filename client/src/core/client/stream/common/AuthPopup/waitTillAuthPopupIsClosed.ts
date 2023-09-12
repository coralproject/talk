import { waitForLocalState } from "coral-framework/lib/relay";
import { waitTillAuthPopupIsClosedLocal } from "coral-stream/__generated__/waitTillAuthPopupIsClosedLocal.graphql";
import { Environment, graphql } from "react-relay";

async function waitTillAuthPopupIsClosed(environment: Environment) {
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
