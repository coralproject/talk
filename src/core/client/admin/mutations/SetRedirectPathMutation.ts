import { commitLocalUpdate, Environment } from "relay-runtime";

import { ADMIN_REDIRECT_PATH_KEY } from "coral-admin/constants";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

export interface SetRedirectPathInput {
  path: string | null;
}

const SetRedirectPathMutation = createMutation(
  "setRedirectPath",
  async (
    environment: Environment,
    input: SetRedirectPathInput,
    { localStorage }: CoralContext
  ) => {
    if (!input.path) {
      await localStorage.removeItem(ADMIN_REDIRECT_PATH_KEY);
    } else {
      await localStorage.setItem(ADMIN_REDIRECT_PATH_KEY, input.path);
    }

    return commitLocalUpdate(environment, (store) => {
      const record = store.get(LOCAL_ID)!;
      record.setValue(input.path, "redirectPath");
    });
  }
);

export default SetRedirectPathMutation;
