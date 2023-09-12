import { RouteProps, useRouter } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { createRouteConfig } from "coral-framework/lib/router";

import { StoriesRouteQueryResponse } from "coral-admin/__generated__/StoriesRouteQuery.graphql";

import Stories from "./Stories";

interface Props {
  data: StoriesRouteQueryResponse;
}

const StoriesRoute: FunctionComponent<Props> & { routeConfig: RouteProps } = ({
  data,
}) => {
  const { match } = useRouter();
  const initialSearchFilter = match.location.query.q;

  if (!data) {
    return null;
  }

  return <Stories query={data} initialSearchFilter={initialSearchFilter} />;
};

StoriesRoute.routeConfig = createRouteConfig({
  Component: StoriesRoute,
  query: graphql`
    query StoriesRouteQuery {
      viewer {
        moderationScopes {
          scoped
          sites {
            id
          }
        }
      }
    }
  `,
  cacheConfig: { force: true },
});

export default StoriesRoute;
