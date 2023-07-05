import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

export type View =
  | "SIGN_IN"
  | "SIGN_UP"
  | "FORGOT_PASSWORD"
  | "ADD_EMAIL_ADDRESS"
  | "CREATE_USERNAME"
  | "CREATE_PASSWORD"
  | "LINK_ACCOUNT";

export interface SetViewInput {
  // TODO: replace with generated typescript types.
  view: View;
  history?: "push" | "replace";
}

const SetViewMutation = createMutation(
  "setView",
  (environment: Environment, input: SetViewInput, { window }) => {
    return commitLocalUpdate(environment, (store) => {
      const record = store.get(LOCAL_ID)!;

      if (input.history) {
        const newLocation = window.location.href.replace(
          /\?[^#]*/,
          `?view=${input.view}`
        );
        const previousState = window.history.state;
        switch (input.history) {
          case "push":
            window.history.pushState(
              previousState,
              window.document.title,
              newLocation
            );
            break;
          case "replace":
            window.history.replaceState(
              previousState,
              window.document.title,
              newLocation
            );
            break;
          default:
        }
      }

      record.setValue(input.view, "view");
    });
  }
);

export default SetViewMutation;
