import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { FromContainer_email } from "coral-admin/__generated__/FromContainer_email.graphql";

import { OnInitValuesFct } from "./EmailConfigContainer";
import From from "./From";

interface Props {
  disabled: boolean;
  onInitValues: OnInitValuesFct;
  email: FromContainer_email;
}

class FromContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues({ email: props.email });
  }

  public render() {
    const { disabled } = this.props;
    return <From disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  email: graphql`
    fragment FromContainer_email on EmailConfiguration {
      enabled
      fromName
      fromEmail
    }
  `,
})(FromContainer);

export default enhanced;
