import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { CheckBox } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { UserStatusSitesListSelectedSiteQuery as QueryTypes } from "coral-admin/__generated__/UserStatusSitesListSelectedSiteQuery.graphql";

interface Props {
  siteID: string;
  onChange: (id: string | null, on: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

const UserStatusSitesListSelectedSiteQuery: FunctionComponent<Props> = ({
  siteID,
  onChange,
  checked,
  disabled = false,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserStatusSitesListSelectedSiteQuery($siteID: ID!) {
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
              checked={checked}
              onChange={() => onChange(siteID, !checked)}
              data-testid="user-status-selected-site"
              disabled={disabled}
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

export default UserStatusSitesListSelectedSiteQuery;
