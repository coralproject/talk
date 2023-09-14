import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { GQLUSER_ROLE } from "coral-framework/schema";

import { ControlPanelRouteQueryResponse } from "coral-admin/__generated__/ControlPanelRouteQuery.graphql";

import ControlPanel from "./ControlPanel";

interface Props {
  data: ControlPanelRouteQueryResponse | null;
}

const ControlPanelRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return null;
  }

  const { viewer } = data;

  if (!viewer || viewer.role !== GQLUSER_ROLE.ADMIN) {
    return null;
  }

  return <ControlPanel />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ControlPanelRouteQuery {
      viewer {
        role
      }
    }
  `,
})(ControlPanelRoute);

export default enhanced;
