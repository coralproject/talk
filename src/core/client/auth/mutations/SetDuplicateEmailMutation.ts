import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

export interface SetDuplicateEmailInput {
  duplicateEmail: string | null;
}

/**
 * SetDuplicateEmailMutation is used to set the duplicateEmail in localState.
 * If duplicateEmail is != null, then we will trigger account linking.
 */
const SetDuplicateEmailMutation = createMutation(
  "setDuplicateEmail",
  async (
    environment: Environment,
    input: SetDuplicateEmailInput,
    { sessionStorage }
  ) => {
    if (input.duplicateEmail === null) {
      await sessionStorage.removeItem("duplicateEmail");
    } else {
      await sessionStorage.setItem("duplicateEmail", input.duplicateEmail);
    }
    return commitLocalUpdate(environment, store => {
      const record = store.get(LOCAL_ID)!;
      record.setValue(input.duplicateEmail, "duplicateEmail");
    });
  }
);

export default SetDuplicateEmailMutation;
