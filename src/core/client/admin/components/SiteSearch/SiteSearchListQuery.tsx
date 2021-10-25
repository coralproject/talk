import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";

import { SiteSearchListQuery as QueryTypes } from "coral-admin/__generated__/SiteSearchListQuery.graphql";

import SiteSearchList from "./SiteSearchList";
import { QueryError } from "coral-ui/components/v3";

interface Props {
  onSelect: (id: string | null) => void;
  siteID: string | null;
  setIsSiteSearchListVisible: (isVisible: boolean) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
}

const SiteSearchListQuery: FunctionComponent<Props> = ({
  onSelect,
  siteID,
  setIsSiteSearchListVisible,
  searchFilter,
  setSearchFilter,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query SiteSearchListQuery($searchFilter: String!) {
          ...SiteSearchList_query @arguments(searchFilter: $searchFilter)
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
            <SiteSearchList
              query={props}
              onSelect={onSelect}
              siteID={siteID}
              setIsSiteSearchListVisible={setIsSiteSearchListVisible}
              setSearchFilter={setSearchFilter}
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
