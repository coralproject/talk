import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, HorizontalGutter, Spinner } from "coral-ui/components/v2";

import { EditEmailDomainRouteQueryResponse } from "coral-admin/__generated__/EditEmailDomainRouteQuery.graphql";

import EmailDomainForm from "./EmailDomainForm";

interface Props {
  data: EditEmailDomainRouteQueryResponse | null;
}

const EditEmailDomainRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data || !data.emailDomain) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  return (
    <HorizontalGutter size="double">
      <ConfigBox
        title={
          <Localized id="configure-moderation-emailDomains-edit">
            <Header>Edit email domain</Header>
          </Localized>
        }
      >
        <EmailDomainForm emailDomain={data.emailDomain} />
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query EditEmailDomainRouteQuery($emailDomainID: ID!) {
      emailDomain(id: $emailDomainID) {
        domain
        id
        newUserModeration
      }
    }
  `,
  cacheConfig: { force: true },
})(EditEmailDomainRoute);

export default enhanced;
