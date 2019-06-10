import { FormApi } from "final-form";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { CommunityContainerQueryResponse } from "coral-admin/__generated__/CommunityContainerQuery.graphql";
import { withRouteConfig } from "coral-framework/lib/router";

import Community from "./Community";

interface Props {
  data: CommunityContainerQueryResponse | null;
  form: FormApi;
}

const CommunityContainer: FunctionComponent<Props> = props => {
  return <Community query={props.data} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query CommunityContainerQuery {
      ...UserTableContainer_query
    }
  `,
  cacheConfig: { force: true },
})(CommunityContainer);

export default enhanced;
