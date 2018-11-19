import React from "react";
import { graphql } from "react-relay";

import { SSOConfigContainer_auth as AuthData } from "talk-admin/__generated__/SSOConfigContainer_auth.graphql";
import { SSOConfigContainer_authReadOnly as AuthReadOnlyData } from "talk-admin/__generated__/SSOConfigContainer_authReadOnly.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import SSOConfig from "../components/SSOConfig";

interface Props {
  auth: AuthData;
  authReadOnly: AuthReadOnlyData;
  onInitValues: (values: AuthData) => void;
  disabled?: boolean;
}

class SSOConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.auth);
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
