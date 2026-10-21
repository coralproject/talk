import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { AtprotoConfigContainer_auth as AuthData } from "coral-admin/__generated__/AtprotoConfigContainer_auth.graphql";

import AtprotoConfig from "./AtprotoConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
}

const AtprotoConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  auth,
}) => {
  return (
    <AtprotoConfig
      disabled={disabled}
      callbackURL={auth.integrations.atproto.callbackURL}
      clientMetadataURL={auth.integrations.atproto.clientMetadataURL}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment AtprotoConfigContainer_auth on Auth {
      integrations {
        atproto {
          callbackURL
          clientMetadataURL
        }
      }
    }
  `,
})(AtprotoConfigContainer);

export default enhanced;
