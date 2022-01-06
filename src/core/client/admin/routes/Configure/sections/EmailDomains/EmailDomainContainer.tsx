import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { EmailDomainContainer_emailDomain } from "coral-admin/__generated__/EmailDomainContainer_emailDomain.graphql";

import EmailDomainForm from "./EmailDomainForm";

interface Props {
  emailDomain: EmailDomainContainer_emailDomain;
}

const EmailDomainContainer: FunctionComponent<Props> = ({ emailDomain }) => {
  return (
    <HorizontalGutter size="double">
      <ConfigBox
        title={
          <Localized id="configure-moderation-emailDomains-edit">
            <Header>Edit email domain</Header>
          </Localized>
        }
      >
        <EmailDomainForm emailDomain={emailDomain} />
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  emailDomain: graphql`
    fragment EmailDomainContainer_emailDomain on EmailDomain {
      domain
      id
      newUserModeration
    }
  `,
})(EmailDomainContainer);

export default enhanced;
