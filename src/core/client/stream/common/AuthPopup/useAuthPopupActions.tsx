import { useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { LoginPromptEvent, ShowAuthPopupEvent } from "coral-stream/events";
import { useStreamLocal } from "coral-stream/local/StreamLocal";

export interface ShowAuthPopupInput {
  view: "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD";
}

export interface SetAuthPopupStateInput {
  open?: boolean;
  focus?: boolean;
  href?: string;
}

const useAuthPopupActions = () => {
  const { eventEmitter } = useCoralContext();
  const { authPopup } = useStreamLocal();
  const { focus, setFocus, open, setOpen, setView, setHref } = authPopup;

  const show = useCallback(
    (input: ShowAuthPopupInput) => {
      if (input.view === "SIGN_IN") {
        LoginPromptEvent.emit(eventEmitter);
      }
      ShowAuthPopupEvent.emit(eventEmitter, { view: input.view });

      setView(input.view);

      if (!open) {
        setOpen(true);
        return;
      }
      if (!focus) {
        setFocus(true);
        return;
      }
    },
    [eventEmitter, focus, open, setFocus, setOpen, setView]
  );

  const setState = useCallback(
    (input: SetAuthPopupStateInput) => {
      if (input.open !== undefined) {
        setOpen(input.open);
      }
      if (input.focus !== undefined) {
        setFocus(input.focus);
      }
      if (input.href !== undefined) {
        setHref(input.href);
      }
    },
    [setOpen, setFocus, setHref]
  );

  return [{ show, setState }];
};

export default useAuthPopupActions;
