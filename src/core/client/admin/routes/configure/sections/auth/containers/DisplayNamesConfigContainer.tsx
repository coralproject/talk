import React from "react";
import { graphql } from "react-relay";

import { DisplayNamesConfigContainer_auth as AuthData } from "talk-admin/__generated__/DisplayNamesConfigContainer_auth.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import DisplayNamesConfig from "../components/DisplayNamesConfig";

interface Props {
  auth: AuthData;
  onInitValues: (values: AuthData) => void;
  disabled?: boolean;
}

class DisplayNamesConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.auth);
  }

  public render() {
    const { disabled } = this.props;
    return <DisplayNamesConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment DisplayNamesConfigContainer_auth on Auth {
      displayName {
        enabled
      }
    }
  `,
})(DisplayNamesConfigContainer);

export default enhanced;
