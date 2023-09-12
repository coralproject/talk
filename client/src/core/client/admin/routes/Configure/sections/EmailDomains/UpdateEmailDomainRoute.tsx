import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, HorizontalGutter, Spinner } from "coral-ui/components/v2";

import { UpdateEmailDomainRouteQueryResponse } from "coral-admin/__generated__/UpdateEmailDomainRouteQuery.graphql";

import EmailDomainForm from "./EmailDomainForm";

interface Props {
  data: UpdateEmailDomainRouteQueryResponse | null;
}

const UpdateEmailDomainRoute: FunctionComponent<Props> = ({ data }) => {
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
        data-testid="configure-moderation-emailDomains-update"
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
    query UpdateEmailDomainRouteQuery($emailDomainID: ID!) {
      emailDomain(id: $emailDomainID) {
        domain
        id
        newUserModeration
      }
    }
  `,
  cacheConfig: { force: true },
})(UpdateEmailDomainRoute);

export default enhanced;
