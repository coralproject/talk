import React from "react";
import { graphql } from "react-relay";

import { FacebookConfigContainer_auth as AuthData } from "coral-admin/__generated__/FacebookConfigContainer_auth.graphql";
import { FacebookConfigContainer_authReadOnly as AuthReadOnlyData } from "coral-admin/__generated__/FacebookConfigContainer_authReadOnly.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import FacebookConfig from "./FacebookConfig";

interface Props {
  auth: AuthData;
  authReadOnly: AuthReadOnlyData;
  onInitValues: (values: AuthData) => void;
  disabled?: boolean;
}

class FacebookConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.auth);
  }

  public render() {
    const { disabled, authReadOnly } = this.props;
    return (
      <FacebookConfig
        disabled={disabled}
        callbackURL={authReadOnly.integrations.facebook.callbackURL}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment FacebookConfigContainer_auth on Auth {
      integrations {
        facebook {
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
    fragment FacebookConfigContainer_authReadOnly on Auth {
      integrations {
        facebook {
          callbackURL
        }
      }
    }
  `,
})(FacebookConfigContainer);

export default enhanced;
