import { useCallback } from "react";

import { blur } from "../helpers";

/** useBlurOnEsc returns handlers that calls blur when pressing ESC */
export default function useBlurOnEsc(active: boolean) {
  return {
    onKeyDown: useCallback(
      (evt: React.KeyboardEvent) => {
        if (evt.keyCode === 27) {
          blur();
        }
      },
      [active]
    ),
  };
}
