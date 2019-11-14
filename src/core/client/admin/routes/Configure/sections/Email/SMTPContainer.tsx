import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SMTPContainer_email } from "coral-admin/__generated__/SMTPContainer_email.graphql";

import { OnInitValuesFct } from "./EmailConfigContainer";
import SMTP from "./SMTP";

interface Props {
  email: SMTPContainer_email;
  disabled: boolean;
  onInitValues: OnInitValuesFct;
}

class SMTPContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues({ email: props.email });
  }

  public render() {
    const { disabled } = this.props;
    return <SMTP disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  email: graphql`
    fragment SMTPContainer_email on EmailConfiguration {
      enabled
      smtp {
        host
        port
        secure
        authentication
        username
        password
      }
    }
  `,
})(SMTPContainer);

export default enhanced;
