import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { FacebookConfigContainer_auth as AuthData } from "coral-admin/__generated__/FacebookConfigContainer_auth.graphql";

import FacebookConfig from "./FacebookConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
}

const FacebookConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  auth,
}) => {
  return (
    <FacebookConfig
      disabled={disabled}
      callbackURL={auth.integrations.facebook.callbackURL}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment FacebookConfigContainer_auth on Auth {
      integrations {
        facebook {
          callbackURL
        }
      }
    }
  `,
})(FacebookConfigContainer);

export default enhanced;
