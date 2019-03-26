import { FormApi } from "final-form";
import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { StoriesContainerQueryResponse } from "talk-admin/__generated__/StoriesContainerQuery.graphql";
import { withRouteConfig } from "talk-framework/lib/router";

import Stories from "../components/Stories";

interface Props {
  data: StoriesContainerQueryResponse | null;
  form: FormApi;
}

const StoriesContainer: StatelessComponent<Props> = props => {
  return <Stories query={props.data} />;
};

const enhanced = withRouteConfig({
  query: graphql`
    query StoriesContainerQuery {
      ...StoryTableContainer_query
    }
  `,
  cacheConfig: { force: true },
})(StoriesContainer);

export default enhanced;
