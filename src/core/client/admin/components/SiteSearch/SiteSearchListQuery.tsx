import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { SiteSearchListContainer_query } from "coral-admin/__generated__/SiteSearchListContainer_query.graphql";
import { SiteSearchListQuery as QueryTypes } from "coral-admin/__generated__/SiteSearchListQuery.graphql";

import SiteSearchListContainer from "./SiteSearchListContainer";

interface Props {
  onSelect: (
    site: SiteSearchListContainer_query["sites"]["edges"][0]["node"] | null
  ) => void;
  siteID: string | null;
  searchFilter: string;
}

const SiteSearchListQuery: FunctionComponent<Props> = ({
  onSelect,
  siteID,
  searchFilter,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query SiteSearchListQuery($searchFilter: String!) {
          ...SiteSearchListContainer_query
            @arguments(searchFilter: $searchFilter)
        }
      `}
      variables={{
        searchFilter,
      }}
      cacheConfig={{ force: true }}
      render={({ error, props }) => {
        if (error) {
          return <QueryError error={error} />;
        }

        if (!props) {
          return null;
        }

        if (props) {
          return (
            <SiteSearchListContainer
              query={props}
              onSelect={onSelect}
              siteID={siteID}
              searchFilter={searchFilter}
            />
          );
        }

        return null;
      }}
    />
  );
};

export default SiteSearchListQuery;
