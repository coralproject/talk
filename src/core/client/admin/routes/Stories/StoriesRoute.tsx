import { FormApi } from "final-form";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { StoriesRouteQueryResponse } from "coral-admin/__generated__/StoriesRouteQuery.graphql";
import { withRouteConfig } from "coral-framework/lib/router";

import Stories from "./Stories";

interface Props {
  data: StoriesRouteQueryResponse | null;
  form: FormApi;
  initialSearchFilter?: string;
}

const StoriesRoute: FunctionComponent<Props> = props => {
  return (
    <Stories
      query={props.data}
      initialSearchFilter={props.initialSearchFilter}
    />
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query StoriesRouteQuery($searchFilter: String) {
      ...StoryTableContainer_query @arguments(searchFilter: $searchFilter)
    }
  `,
  cacheConfig: { force: true },
  prepareVariables: (params, match) => {
    return {
      searchFilter: match.location.query.q,
    };
  },
  render: ({ match, Component, ...rest }) => (
    <Component initialSearchFilter={match.location.query.q} {...rest} />
  ),
})(StoriesRoute);

export default enhanced;
