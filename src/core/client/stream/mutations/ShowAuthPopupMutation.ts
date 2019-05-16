import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer } from "coral-framework/lib/relay";

import { AUTH_POPUP_ID } from "../local";

export interface ShowAuthPopupInput {
  view: "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD";
}

export type ShowAuthPopupMutation = (
  input: ShowAuthPopupInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: ShowAuthPopupInput
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(AUTH_POPUP_ID)!;
    record.setValue(input.view, "view");
    if (!record.getValue("open")) {
      record.setValue(true, "open");
      return;
    }
    if (!record.getValue("focus")) {
      record.setValue(true, "focus");
      return;
    }
  });
}

export const withShowAuthPopupMutation = createMutationContainer(
  "showAuthPopup",
  commit
);
