import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { SetRedirectPathMutation } from "coral-admin/mutations";
import { waitFor } from "coral-common/helpers";
import { MutationProp, withMutation } from "coral-framework/lib/relay";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

import { RestrictedContainer_viewer$key as ViewerData } from "coral-admin/__generated__/RestrictedContainer_viewer.graphql";

import Restricted from "./Restricted";

interface Props {
  viewer: ViewerData | null;
  error?: Error | null;
  signOut: SignOutMutation;
  setRedirectPath: MutationProp<typeof SetRedirectPathMutation>;
}

const RestrictedContainer: FunctionComponent<Props> = ({
  viewer,
  error,
  signOut,
  setRedirectPath,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment RestrictedContainer_viewer on User {
        username
      }
    `,
    viewer
  );

  const handleSignInAs = useCallback(async () => {
    await signOut();
    // Wait for new context to propagate.
    await waitFor();
    void setRedirectPath({
      path: location.pathname + location.search + location.hash,
    });
  }, [signOut, setRedirectPath]);

  if (!viewerData) {
    return null;
  }

  return (
    <Restricted username={viewerData.username} onSignInAs={handleSignInAs} />
  );
};

const enhanced = withMutation(SetRedirectPathMutation)(
  withSignOutMutation(RestrictedContainer)
);

export default enhanced;
