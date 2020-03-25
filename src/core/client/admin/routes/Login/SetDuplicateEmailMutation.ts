import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

export interface SetDuplicateEmailInput {
  duplicateEmail: string | null;
}

/**
 * SetDuplicateEmailMutation is used to set the duplicateEmail in localState.
 * It is used in the `LINK_ACCOUNT` view.
 */
const SetDuplicateEmailMutation = createMutation(
  "setDuplicateEmail",
  async (environment: Environment, input: SetDuplicateEmailInput) => {
    return commitLocalUpdate(environment, (store) => {
      const record = store.get(LOCAL_ID)!;
      record.setValue(input.duplicateEmail, "authDuplicateEmail");
    });
  }
);

export default SetDuplicateEmailMutation;
