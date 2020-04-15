import { FormApi } from "final-form";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { CommunityRouteQueryResponse } from "coral-admin/__generated__/CommunityRouteQuery.graphql";

import Community from "./Community";

interface Props {
  data: CommunityRouteQueryResponse | null;
  form: FormApi;
}

const CommunityRoute: FunctionComponent<Props> = (props) => {
  return <Community query={props.data} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query CommunityRouteQuery {
      ...UserTableContainer_query
    }
  `,
  cacheConfig: { force: true },
})(CommunityRoute);

export default enhanced;
