import { commitLocalUpdate, Environment } from "relay-runtime";

import { REDIRECT_PATH_KEY } from "talk-admin/constants";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutation, LOCAL_ID } from "talk-framework/lib/relay";

export interface SetRedirectPathInput {
  path: string | null;
}

const SetRedirectPathMutation = createMutation(
  "setRedirectPath",
  async (
    environment: Environment,
    input: SetRedirectPathInput,
    { localStorage }: TalkContext
  ) => {
    if (!input.path) {
      await localStorage.removeItem(REDIRECT_PATH_KEY);
    } else {
      await localStorage.setItem(REDIRECT_PATH_KEY, input.path);
    }

    return commitLocalUpdate(environment, store => {
      const record = store.get(LOCAL_ID)!;
      record.setValue(input.path, "redirectPath");
    });
  }
);

export default SetRedirectPathMutation;
