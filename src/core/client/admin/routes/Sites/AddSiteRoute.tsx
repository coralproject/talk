import React, { FunctionComponent } from "react";

import { graphql } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

import { AddSiteRouteQuery } from "coral-admin/__generated__/AddSiteRouteQuery.graphql";

interface Props {
  query: AddSiteRouteQuery;
}

const AddSiteRoute: FunctionComponent<Props> = () => {
  return (
    <div>
      <h2>Add a new site</h2>
    </div>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query AddSiteRouteQuery {
      settings {
        organization {
          name
        }
      }
    }
  `,
  cacheConfig: { force: true },
})(AddSiteRoute);

export default enhanced;
