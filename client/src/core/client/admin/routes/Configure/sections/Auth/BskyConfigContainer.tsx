import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { BskyConfigContainer_auth as AuthData } from "coral-admin/__generated__/BskyConfigContainer_auth.graphql"

import BskyConfig from "./BskyConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
}

const BskyConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  auth,
}) => {
  return (
    <BskyConfig
      disabled={disabled}
      callbackURL={auth.integrations.bsky.callbackURL}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment BskyConfigContainer_auth on Auth {
      integrations {
        bsky {
          callbackURL
        }
      }
    }
  `,
})(BskyConfigContainer);

export default enhanced;
