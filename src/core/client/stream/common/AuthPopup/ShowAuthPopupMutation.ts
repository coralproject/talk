import { commitLocalUpdate, Environment } from "relay-runtime";

import { waitFor } from "coral-common/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  createMutation,
  createMutationContainer,
  lookup,
} from "coral-framework/lib/relay";
import { LoginPromptEvent, ShowAuthPopupEvent } from "coral-stream/events";

import { AUTH_POPUP_ID } from "../../local";

export interface ShowAuthPopupInput {
  view: "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD";
}

export async function commit(
  environment: Environment,
  input: ShowAuthPopupInput,
  { eventEmitter }: Pick<CoralContext, "eventEmitter">
) {
  if (input.view === "SIGN_IN") {
    LoginPromptEvent.emit(eventEmitter);
  }
  ShowAuthPopupEvent.emit(eventEmitter, { view: input.view });
  const authPopup = lookup(environment, AUTH_POPUP_ID);
  if (authPopup.open) {
    // If popup is already open, we set focus to false and then later to true,
    // to trigger it to reappear.
    commitLocalUpdate(environment, (store) => {
      const record = store.get(AUTH_POPUP_ID)!;
      record.setValue(false, "focus");
    });
    await waitFor(0);
  }
  commitLocalUpdate(environment, (store) => {
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

export default createMutation("showAuthPopup", commit);
