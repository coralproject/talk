import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { GoogleConfigContainer_auth as AuthData } from "coral-admin/__generated__/GoogleConfigContainer_auth.graphql";

import GoogleConfig from "./GoogleConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
}

const GoogleConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  auth,
}) => {
  return (
    <GoogleConfig
      disabled={disabled}
      callbackURL={auth.integrations.google.callbackURL}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment GoogleConfigContainer_auth on Auth {
      integrations {
        google {
          callbackURL
        }
      }
    }
  `,
})(GoogleConfigContainer);

export default enhanced;
