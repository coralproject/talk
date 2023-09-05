import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

export type View =
  | "ADD_EMAIL_ADDRESS"
  | "CREATE_PASSWORD"
  | "CREATE_USERNAME"
  | "LINK_ACCOUNT"
  | "SIGN_IN";

export interface SetAuthViewInput {
  // TODO: replace with generated typescript types.
  view: View;
}

const SetAuthViewMutation = createMutation(
  "setAuthView",
  (environment: Environment, input: SetAuthViewInput) =>
    commitLocalUpdate(environment, (store) => {
      const record = store.get(LOCAL_ID)!;
      record.setValue(input.view, "authView");
    })
);

export default SetAuthViewMutation;
