import React, { FunctionComponent, useState } from "react";
import { graphql, useFragment } from "react-relay";

import { ForgotPasswordContainer_viewer$key as ForgotPasswordContainer_viewer } from "coral-auth/__generated__/ForgotPasswordContainer_viewer.graphql";

import CheckEmail from "./CheckEmail";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface Props {
  viewer: ForgotPasswordContainer_viewer | null;
}

const ForgotPasswordContainer: FunctionComponent<Props> = ({ viewer }) => {
  const viewerData = useFragment(
    graphql`
      fragment ForgotPasswordContainer_viewer on User {
        email
      }
    `,
    viewer
  );

  const [checkEmail, setCheckEmail] = useState<string | null>(null);

  // We rely on the email address being provided when the user is logged in.
  // Normally we'd have to be concerned about how the access token is being passed
  // because of the auth state issues present with browsers that do weird things
  // to segment data, but thankfully this is only used for local auth, which
  // means that the auth data in the browser is the same as what's available to
  // the embed.
  const email = viewerData ? viewerData.email : null;

  return checkEmail ? (
    <CheckEmail email={checkEmail} />
  ) : (
    <ForgotPasswordForm email={email} onCheckEmail={setCheckEmail} />
  );
};

export default ForgotPasswordContainer;
