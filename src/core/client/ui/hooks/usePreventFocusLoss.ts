import { useCallback } from "react";

import { useUIContext } from "coral-ui/components/v2";

/** usePreventFocusLoss returns event handlers that will prevent the current focus from being lost */
export default function usePreventFocusLoss(active: boolean) {
  const { renderWindow } = useUIContext();
  return {
    onMouseDown: useCallback(
      (evt: React.MouseEvent) => {
        if (!active || evt.target === renderWindow.document.activeElement) {
          return;
        }
        evt.preventDefault();
      },
      [active, renderWindow]
    ),
  };
}
