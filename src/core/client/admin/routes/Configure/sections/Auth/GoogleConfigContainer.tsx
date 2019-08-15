import React from "react";
import { graphql } from "react-relay";

import { GoogleConfigContainer_auth as AuthData } from "coral-admin/__generated__/GoogleConfigContainer_auth.graphql";
import { GoogleConfigContainer_authReadOnly as AuthReadOnlyData } from "coral-admin/__generated__/GoogleConfigContainer_authReadOnly.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { OnInitValuesFct } from "./AuthConfigContainer";
import GoogleConfig from "./GoogleConfig";

interface Props {
  auth: AuthData;
  authReadOnly: AuthReadOnlyData;
  onInitValues: OnInitValuesFct;
  disabled?: boolean;
}

class GoogleConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues({ auth: props.auth });
  }

  public render() {
    const { disabled, authReadOnly } = this.props;
    return (
      <GoogleConfig
        disabled={disabled}
        callbackURL={authReadOnly.integrations.google.callbackURL}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment GoogleConfigContainer_auth on Auth {
      integrations {
        google {
          enabled
          allowRegistration
          targetFilter {
            admin
            stream
          }
          clientID
          clientSecret
        }
      }
    }
  `,
  authReadOnly: graphql`
    fragment GoogleConfigContainer_authReadOnly on Auth {
      integrations {
        google {
          callbackURL
        }
      }
    }
  `,
})(GoogleConfigContainer);

export default enhanced;
