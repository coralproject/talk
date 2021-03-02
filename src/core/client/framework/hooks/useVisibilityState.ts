import { useEffect, useState } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

function isVisible(state: VisibilityState) {
  return state === "visible";
}

/**
 * useVisibilityState renders the `document.visibilityState` as a hook that will
 * stay synced to the document's events associated with changes, so you can
 * safely use the returned value as dependancies for other hooks involving
 * visiblity.
 */
function useVisibilityState() {
  const { window } = useCoralContext();
  const [state, setState] = useState(
    isVisible(window.document.visibilityState)
  );

  useEffect(() => {
    // update will set the visibility state if it differs from the current react
    // state.
    const update = () => {
      const current = isVisible(window.document.visibilityState);
      if (state !== current) {
        setState(current);
      }
    };

    // Update it now!
    update();

    // Register for when that changes!
    window.document.addEventListener("visibilitychange", update);

    return () => {
      window.document.removeEventListener("visibilitychange", update);
    };
  }, [state, window.document]);

  return state;
}

export default useVisibilityState;
