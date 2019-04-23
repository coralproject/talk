import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

const ClearAuthErrorMutation = createMutation(
  "clearAuthError",
  (environment: Environment) =>
    commitLocalUpdate(environment, store => {
      const record = store.get(LOCAL_ID)!;
      record.setValue(null, "authError");
    })
);

export default ClearAuthErrorMutation;
