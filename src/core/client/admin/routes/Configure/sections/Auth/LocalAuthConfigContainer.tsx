import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { LocalAuthConfigContainer_auth as AuthData } from "coral-admin/__generated__/LocalAuthConfigContainer_auth.graphql";

import { OnInitValuesFct } from "./AuthConfigContainer";
import LocalAuthConfig from "./LocalAuthConfig";

interface Props {
  auth: AuthData;
  onInitValues: OnInitValuesFct;
  disabled?: boolean;
}

class LocalAuthConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues({ auth: props.auth });
  }

  public render() {
    const { disabled } = this.props;
    return <LocalAuthConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment LocalAuthConfigContainer_auth on Auth {
      integrations {
        local {
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
})(LocalAuthConfigContainer);

export default enhanced;
