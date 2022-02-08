import { Location, LocationDescriptorObject, useRouter } from "found";
import React, { useEffect } from "react";

import { withContext } from "coral-framework/lib/bootstrap";

interface Props {
  /** transitionControl is injected by `withContext` HOC */
  transitionControl: TransitionControlData | undefined;
}

/**
 * TransitionControlData allows controlling router transition.
 */
export interface TransitionControlData {
  /** allowTransition if set to false, will prevent router transitions from happening. */
  allowTransition: boolean;
  /** history contains all records of router transition requests. */
  history: Array<Location | LocationDescriptorObject>;
}

const TransitionControl: React.FunctionComponent<Props> = (props) => {
  const { router } = useRouter();
  useEffect(() => {
    return router.addNavigationListener((location) => {
      if (props.transitionControl && location) {
        // location should be never null unless using `beforeUnload`
        // https://github.com/4Catalyzer/farce#navigation-listeners.
        props.transitionControl.history.push(location);
        if (!props.transitionControl.allowTransition) {
          return false;
        }
      }
      return;
    });
  }, [router, props.transitionControl]);
  return null;
};

const enhanced = withContext(({ transitionControl }) => ({
  transitionControl,
}))(TransitionControl);

export default enhanced;
