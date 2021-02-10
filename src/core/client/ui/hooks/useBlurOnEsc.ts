import { useCallback } from "react";

import { useUIContext } from "coral-ui/components/v2/UIContext";

import { blur } from "../helpers";

/** useBlurOnEsc returns handlers that calls blur when pressing ESC */
export default function useBlurOnEsc(active: boolean) {
  const { renderWindow } = useUIContext();
  return {
    onKeyDown: useCallback(
      (evt: React.KeyboardEvent) => {
        if (evt.keyCode === 27) {
          blur(renderWindow);
        }
      },
      [renderWindow]
    ),
  };
}
