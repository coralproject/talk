import { Location, LocationDescriptorObject, useRouter } from "found";
import React, { useEffect } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

/**
 * TransitionControlData allows controlling router transition.
 */
export interface TransitionControlData {
  /** allowTransition if set to false, will prevent router transitions from happening. */
  allowTransition: boolean;
  /** history contains all records of router transition requests. */
  history: Array<Location | LocationDescriptorObject>;
}

const TransitionControl: React.FunctionComponent = (props) => {
  const { router } = useRouter();
  const { transitionControl } = useCoralContext();
  useEffect(() => {
    return router.addNavigationListener((location) => {
      if (transitionControl && location) {
        // location should be never null unless using `beforeUnload`
        // https://github.com/4Catalyzer/farce#navigation-listeners.
        transitionControl.history.push(location);
        if (!transitionControl.allowTransition) {
          return false;
        }
      }
      return;
    });
  }, [router, transitionControl]);
  return null;
};

export default TransitionControl;
