import { useCallback } from "react";

/** usePreventFocusLoss returns event handlers that will prevent the current focus from being lost */
export default function usePreventFocusLoss(active: boolean) {
  return {
    onMouseDown: useCallback(
      (evt: React.MouseEvent) => {
        if (!active || evt.target === window.document.activeElement) {
          return;
        }
        evt.preventDefault();
      },
      [active]
    ),
  };
}
