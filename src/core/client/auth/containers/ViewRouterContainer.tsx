import { FunctionComponent, useEffect } from "react";

import { SetViewMutation } from "talk-auth/mutations";
import { View } from "talk-auth/mutations/SetViewMutation";
import { parseQuery } from "talk-common/utils";
import { useMutation } from "talk-framework/lib/relay";

/**
 * ViewRouterContainer listens for changes to the location
 * parses the `?view=` and calls the `setView` mutation.
 */
const ViewRouterContainer: FunctionComponent = () => {
  const setView = useMutation(SetViewMutation);
  useEffect(() => {
    window.onpopstate = () => {
      const query = parseQuery(window.location.search);
      setView({ view: query.view as View });
    };
    return () => {
      window.onpopstate = null;
    };
  }, [setView]);
  return null;
};

export default ViewRouterContainer;
