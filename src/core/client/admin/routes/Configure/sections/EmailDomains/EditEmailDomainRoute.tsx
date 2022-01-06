import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { EditEmailDomainRouteQueryResponse } from "coral-admin/__generated__/EditEmailDomainRouteQuery.graphql";

import EmailDomainContainer from "./EmailDomainContainer";

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

  return <EmailDomainContainer emailDomain={data.emailDomain} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query EditEmailDomainRouteQuery($emailDomainID: ID!) {
      emailDomain(id: $emailDomainID) {
        ...EmailDomainContainer_emailDomain
      }
    }
  `,
  cacheConfig: { force: true },
})(EditEmailDomainRoute);

export default enhanced;
