import React from "react";
import { graphql, useFragment } from "react-relay";

import { GoogleConfigContainer_auth$key as AuthData } from "coral-admin/__generated__/GoogleConfigContainer_auth.graphql";

import GoogleConfig from "./GoogleConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
}

const GoogleConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  auth,
}) => {
  const authData = useFragment(
    graphql`
      fragment GoogleConfigContainer_auth on Auth {
        integrations {
          google {
            callbackURL
          }
        }
      }
    `,
    auth
  );

  return (
    <GoogleConfig
      disabled={disabled}
      callbackURL={authData.integrations.google.callbackURL}
    />
  );
};

export default GoogleConfigContainer;
