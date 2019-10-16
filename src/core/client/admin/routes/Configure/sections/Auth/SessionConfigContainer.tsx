import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SessionConfigContainer_auth as AuthData } from "coral-admin/__generated__/SessionConfigContainer_auth.graphql";

import { OnInitValuesFct } from "./AuthConfigContainer";
import SessionConfig from "./SessionConfig";

interface Props {
  auth: AuthData;
  onInitValues: OnInitValuesFct;
  disabled?: boolean;
}

class SessionConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues({ auth: props.auth });
  }

  public render() {
    const { disabled } = this.props;
    return <SessionConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SessionConfigContainer_auth on Auth {
      sessionDuration
    }
  `,
})(SessionConfigContainer);
export default enhanced;
