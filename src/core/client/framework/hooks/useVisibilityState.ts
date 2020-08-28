import { useEffect, useState } from "react";

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
  const [state, setState] = useState(isVisible(document.visibilityState));

  useEffect(() => {
    // update will set the visibility state if it differs from the current react
    // state.
    const update = () => {
      const current = isVisible(document.visibilityState);
      if (state !== current) {
        setState(current);
      }
    };

    // Update it now!
    update();

    // Register for when that changes!
    document.addEventListener("visibilitychange", update);

    return () => {
      document.removeEventListener("visibilitychange", update);
    };
  }, [state]);

  return state;
}

export default useVisibilityState;
