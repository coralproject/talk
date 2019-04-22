import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export interface SetAuthViewInput {
  // TODO: replace with generated typescript types.
  view: "SIGN_IN" | "ADD_EMAIL_ADDRESS" | "CREATE_USERNAME" | "CREATE_PASSWORD";
}

const SetAuthViewMutation = createMutation(
  "setAuthView",
  (environment: Environment, input: SetAuthViewInput) =>
    commitLocalUpdate(environment, store => {
      const record = store.get(LOCAL_ID)!;
      record.setValue(input.view, "authView");
    })
);

export default SetAuthViewMutation;
