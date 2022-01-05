import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { EditEmailDomainContainer_emailDomain } from "coral-admin/__generated__/EditEmailDomainContainer_emailDomain.graphql";

import ConfigureEmailDomainForm from "./ConfigureEmailDomainForm";

interface Props {
  emailDomain: EditEmailDomainContainer_emailDomain;
}

const EditEmailDomainContainer: FunctionComponent<Props> = ({
  emailDomain,
}) => {
  return (
    <HorizontalGutter size="double">
      <ConfigBox
        title={
          <Localized id="configure-moderation-emailDomains-edit">
            <Header>Edit email domain</Header>
          </Localized>
        }
      >
        <ConfigureEmailDomainForm emailDomain={emailDomain} />
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  emailDomain: graphql`
    fragment EditEmailDomainContainer_emailDomain on EmailDomain {
      ...ConfigureEmailDomainForm_emailDomain
    }
  `,
})(EditEmailDomainContainer);

export default enhanced;
