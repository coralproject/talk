import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SSOConfigContainer_auth as AuthData } from "coral-admin/__generated__/SSOConfigContainer_auth.graphql";

import SSOConfig from "./SSOConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
}

const SSOConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  auth,
}) => {
  return <SSOConfig disabled={disabled} />;
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SSOConfigContainer_auth on Auth {
      ...SSOConfig_formValues
    }
  `,
})(SSOConfigContainer);

export default enhanced;
