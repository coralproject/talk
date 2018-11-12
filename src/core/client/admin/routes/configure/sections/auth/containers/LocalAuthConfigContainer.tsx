import React from "react";
import { graphql } from "react-relay";

import { LocalAuthConfigContainer_auth as AuthData } from "talk-admin/__generated__/LocalAuthConfigContainer_auth.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import LocalAuthConfig from "../components/LocalAuthConfig";

interface Props {
  auth: AuthData;
  onInitValues: (values: AuthData) => void;
  disabled?: boolean;
}

class LocalAuthConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.auth);
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
