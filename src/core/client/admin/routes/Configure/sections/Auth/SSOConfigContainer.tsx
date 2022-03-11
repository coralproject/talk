import React from "react";
import { graphql, useFragment } from "react-relay";

import SSOConfig from "./SSOConfig";

import { SSOConfigContainer_auth$key } from "coral-admin/__generated__/SSOConfigContainer_auth.graphql";

interface Props {
  auth: SSOConfigContainer_auth$key;
  disabled?: boolean;
}

const SSOConfigContainer: React.FunctionComponent<Props> = ({
  auth,
  disabled,
}) => {
  useFragment(
    graphql`
      fragment SSOConfigContainer_auth on Auth {
        ...SSOConfig_formValues
      }
    `,
    auth
  );
  return <SSOConfig disabled={disabled} />;
};

export default SSOConfigContainer;
