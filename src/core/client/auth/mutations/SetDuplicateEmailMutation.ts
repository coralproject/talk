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
  (environment: Environment, input: SetDuplicateEmailInput) => {
    return commitLocalUpdate(environment, store => {
      const record = store.get(LOCAL_ID)!;
      record.setValue(input.duplicateEmail, "duplicateEmail");
    });
  }
);

export default SetDuplicateEmailMutation;
