import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { CheckBox, HorizontalGutter } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { UserStatusSitesListSelectedSitesQuery as QueryTypes } from "coral-admin/__generated__/UserStatusSitesListSelectedSitesQuery.graphql";

interface Props {
  selectedSites: string[];
  onRemoveSite: (id: string | null) => void;
}

const UserStatusSitesListSelectedSitesQuery: FunctionComponent<Props> = ({
  selectedSites,
  onRemoveSite,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserStatusSitesListSelectedSitesQuery($ids: [String]) {
          sites(ids: $ids) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `}
      variables={{ ids: selectedSites }}
      render={({ error, props }: QueryRenderData<QueryTypes>) => {
        if (error) {
          return <QueryError error={error} />;
        }
        if (props && props.sites) {
          const sites = props.sites.edges.map((edge) => edge.node) || [];
          return (
            <HorizontalGutter spacing={3} mt={5} mb={4}>
              {sites.map((site) => {
                return (
                  <CheckBox
                    key={site.id}
                    checked={true}
                    onChange={() => onRemoveSite(site.id)}
                    data-testid="user-status-selected-site"
                  >
                    {site.name}
                  </CheckBox>
                );
              })}
            </HorizontalGutter>
          );
        } else {
          return null;
        }
      }}
    />
  );
};

export default UserStatusSitesListSelectedSitesQuery;
