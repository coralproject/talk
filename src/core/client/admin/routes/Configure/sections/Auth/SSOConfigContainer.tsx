import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SSOConfigContainer_auth as AuthData } from "coral-admin/__generated__/SSOConfigContainer_auth.graphql";
import { SSOConfigContainer_authReadOnly as AuthReadOnlyData } from "coral-admin/__generated__/SSOConfigContainer_authReadOnly.graphql";

import { OnInitValuesFct } from "./AuthConfigContainer";
import SSOConfig from "./SSOConfig";

interface Props {
  auth: AuthData;
  authReadOnly: AuthReadOnlyData;
  onInitValues: OnInitValuesFct;
  disabled?: boolean;
}

class SSOConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues({ auth: props.auth });
  }

  public render() {
    const { disabled } = this.props;
    return (
      <SSOConfig
        disabled={disabled}
        sso={this.props.authReadOnly.integrations.sso}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SSOConfigContainer_auth on Auth {
      integrations {
        sso {
          enabled
          allowRegistration
          targetFilter {
            admin
            stream
          }
        }
      }
    }
  `,
  authReadOnly: graphql`
    fragment SSOConfigContainer_authReadOnly on Auth {
      integrations {
        sso {
          ...SSOKeyFieldContainer_sso
        }
      }
    }
  `,
})(SSOConfigContainer);

export default enhanced;
