import React, { FunctionComponent } from "react";

import {
  graphql,
  QueryRenderData,
  QueryRenderer,
} from "coral-framework/lib/relay";
import Spinner from "coral-stream/common/Spinner";
import { Delay } from "coral-ui/components";

import { SiteSelectorCurrentSiteQuery as QueryTypes } from "coral-admin/__generated__/SiteSelectorCurrentSiteQuery.graphql";

interface Props {
  siteID: string;
}

export const render = ({ error, props }: QueryRenderData<QueryTypes>) => {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (props) {
    return <div>{props.site && props.site.name}</div>;
  }
  return (
    <Delay>
      <Spinner />
    </Delay>
  );
};

const enhanced: FunctionComponent<Props> = ({ siteID }) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query SiteSelectorCurrentSiteQuery($siteID: ID!) {
          site(id: $siteID) {
            id
            name
          }
        }
      `}
      variables={{
        siteID,
      }}
      render={render}
    />
  );
};

export default enhanced;
