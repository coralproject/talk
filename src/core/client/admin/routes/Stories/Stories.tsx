import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "relay-runtime";

import MainLayout from "coral-admin/components/MainLayout";
import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { StoriesQuery as QueryTypes } from "coral-admin/__generated__/StoriesQuery.graphql";
import { StoriesRouteQueryResponse } from "coral-admin/__generated__/StoriesRouteQuery.graphql";

import StoryTableContainer from "./StoryTableContainer";

import styles from "./Stories.css";

interface Props {
  query: StoriesRouteQueryResponse;
  initialSearchFilter?: string;
}

const Stories: FunctionComponent<Props> = ({ query, initialSearchFilter }) => {
  const moderateScopeSites = useMemo(() => {
    if (
      query.viewer?.moderationScopes?.scoped &&
      query.viewer.moderationScopes.sites
    ) {
      return query.viewer.moderationScopes.sites.map((site) => site.id);
    }
    return null;
  }, [query]);
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query StoriesQuery($searchFilter: String, $siteIDs: [ID!]) {
          ...StoryTableContainer_query
            @arguments(searchFilter: $searchFilter, siteIDs: $siteIDs)
        }
      `}
      variables={{
        searchFilter: initialSearchFilter,
        siteIDs: moderateScopeSites,
      }}
      cacheConfig={{ force: true }}
      render={({ error, props }) => {
        if (error) {
          return <QueryError error={error} />;
        }
        return (
          <MainLayout className={styles.root} data-testid="stories-container">
            <StoryTableContainer
              query={props}
              initialSearchFilter={initialSearchFilter}
              moderateScopeSites={moderateScopeSites}
            />
          </MainLayout>
        );
      }}
    />
  );
};

export default Stories;
