import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { SiteSearchListQuery as QueryTypes } from "coral-admin/__generated__/SiteSearchListQuery.graphql";

import SiteSearchListContainer from "./SiteSearchListContainer";

interface Props {
  onSelect: (site: { id: string; name: string } | null) => void;
  searchFilter: string;
  activeSiteID: string | null;
  showOnlyScopedSitesInSearchResults: boolean;
  showAllSitesSearchFilterOption: boolean;
}

const SiteSearchListQuery: FunctionComponent<Props> = ({
  onSelect,
  searchFilter,
  activeSiteID,
  showOnlyScopedSitesInSearchResults,
  showAllSitesSearchFilterOption,
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
              activeSiteID={activeSiteID}
              showOnlyScopedSitesInSearchResults={
                showOnlyScopedSitesInSearchResults
              }
              showAllSitesSearchFilterOption={showAllSitesSearchFilterOption}
            />
          );
        }

        return null;
      }}
    />
  );
};

export default SiteSearchListQuery;
