import { commitLocalUpdate, Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  createMutation,
  createMutationContainer,
} from "coral-framework/lib/relay";
import { LoginPromptEvent, ShowAuthPopupEvent } from "coral-stream/events";

import { AUTH_POPUP_ID } from "../local";

export interface ShowAuthPopupInput {
  view: "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD";
}

export type ShowAuthPopupMutation = (
  input: ShowAuthPopupInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: ShowAuthPopupInput,
  { eventEmitter }: Pick<CoralContext, "eventEmitter">
) {
  if (input.view === "SIGN_IN") {
    LoginPromptEvent.emit(eventEmitter);
  }
  ShowAuthPopupEvent.emit(eventEmitter, { view: input.view });
  return commitLocalUpdate(environment, (store) => {
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
