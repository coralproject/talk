import { commitLocalUpdate, Environment } from "relay-runtime";

import {
  createMutation,
  createMutationContainer,
} from "coral-framework/lib/relay";
import { AUTH_POPUP_ID } from "coral-stream/local";

export interface SetAuthPopupStateInput {
  open?: boolean;
  focus?: boolean;
  href?: string;
}

export type SetAuthPopupStateMutation = (
  input: SetAuthPopupStateInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetAuthPopupStateInput
) {
  return commitLocalUpdate(environment, (store) => {
    const record = store.get(AUTH_POPUP_ID)!;
    if (input.open !== undefined) {
      record.setValue(input.open, "open");
    }
    if (input.focus !== undefined) {
      record.setValue(input.focus, "focus");
    }
    if (input.href !== undefined) {
      record.setValue(input.href, "href");
    }
  });
}

export const withSetAuthPopupStateMutation = createMutationContainer(
  "setAuthPopupState",
  commit
);

export default createMutation("setAuthPopupState", commit);
