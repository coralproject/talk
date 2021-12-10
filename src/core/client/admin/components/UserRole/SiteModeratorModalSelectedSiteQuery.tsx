import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { CheckBox } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { SiteModeratorModalSelectedSiteQuery as QueryTypes } from "coral-admin/__generated__/SiteModeratorModalSelectedSiteQuery.graphql";

interface Props {
  siteID: string;
  onChange: (id: string | null, checked: boolean) => void;
  checked: boolean;
}

const SiteModeratorModalSelectedSiteQuery: FunctionComponent<Props> = ({
  siteID,
  onChange,
  checked,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query SiteModeratorModalSelectedSiteQuery($siteID: ID!) {
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
              key={siteID}
              checked={checked}
              onChange={() => onChange(siteID, checked)}
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

export default SiteModeratorModalSelectedSiteQuery;
