import React from "react";
import { graphql, useFragment } from "react-relay";

import { FacebookConfigContainer_auth$key as AuthData } from "coral-admin/__generated__/FacebookConfigContainer_auth.graphql";

import FacebookConfig from "./FacebookConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
}

const FacebookConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  auth,
}) => {
  const authData = useFragment(
    graphql`
      fragment FacebookConfigContainer_auth on Auth {
        integrations {
          facebook {
            callbackURL
          }
        }
      }
    `,
    auth
  );

  return (
    <FacebookConfig
      disabled={disabled}
      callbackURL={authData.integrations.facebook.callbackURL}
    />
  );
};

export default FacebookConfigContainer;
