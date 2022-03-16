import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { CheckBox } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { SpecificSitesSelectedQuery as QueryTypes } from "coral-admin/__generated__/SpecificSitesSelectedQuery.graphql";

interface Props {
  siteID: string;
  onChange: (id: string) => void;
}

const SpecificSitesSelectedQuery: FunctionComponent<Props> = ({
  siteID,
  onChange,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query SpecificSitesSelectedQuery($siteID: ID!) {
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
        return props && props.site ? (
          <CheckBox checked onChange={() => onChange(siteID)}>
            {props.site.name}
          </CheckBox>
        ) : null;
      }}
    />
  );
};

export default SpecificSitesSelectedQuery;
