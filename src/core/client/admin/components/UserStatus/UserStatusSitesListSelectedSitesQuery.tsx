import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { CheckBox } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { UserStatusSitesListSelectedSitesQuery as QueryTypes } from "coral-admin/__generated__/UserStatusSitesListSelectedSitesQuery.graphql";

interface Props {
  siteID: string;
  onChange: (id: string | null) => void;
}

const UserStatusSitesListSelectedSitesQuery: FunctionComponent<Props> = ({
  siteID,
  onChange,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserStatusSitesListSelectedSitesQuery($siteID: ID!) {
          site(id: $siteID) {
            name
          }
        }
      `}
      variables={{
        siteID,
      }}
      render={({ error, props }: QueryRenderData<QueryTypes>) => {
        if (error) {
          return <QueryError error={error} />;
        }
        if (props && props.site) {
          return (
            <CheckBox
              checked={true}
              onChange={() => onChange(siteID)}
              data-testid="user-status-selected-site"
            >
              {props.site.name}
            </CheckBox>
          );
        } else {
          return null;
        }
      }}
    />
  );
};

export default UserStatusSitesListSelectedSitesQuery;
