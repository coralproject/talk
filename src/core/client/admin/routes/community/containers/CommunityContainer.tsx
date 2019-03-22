import { FormApi } from "final-form";
import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { CommunityContainerQueryResponse } from "talk-admin/__generated__/CommunityContainerQuery.graphql";
import { withRouteConfig } from "talk-framework/lib/router";

import Community from "../components/Community";

interface Props {
  data: CommunityContainerQueryResponse | null;
  form: FormApi;
}

const CommunityContainer: StatelessComponent<Props> = props => {
  return <Community query={props.data} />;
};

const enhanced = withRouteConfig({
  query: graphql`
    query CommunityContainerQuery {
      ...UserTableContainer_query
    }
  `,
  cacheConfig: { force: true },
})(CommunityContainer);

export default enhanced;
