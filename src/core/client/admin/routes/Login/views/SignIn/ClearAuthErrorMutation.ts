import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

const ClearAuthErrorMutation = createMutation(
  "clearAuthError",
  (environment: Environment) =>
    commitLocalUpdate(environment, (store) => {
      const record = store.get(LOCAL_ID);
      if (!record) {
        return;
      }

      record.setValue(null, "authError");
    })
);

export default ClearAuthErrorMutation;
