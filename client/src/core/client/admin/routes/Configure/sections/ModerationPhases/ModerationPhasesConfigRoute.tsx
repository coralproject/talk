import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { ModerationPhasesConfigRouteQueryResponse } from "coral-admin/__generated__/ModerationPhasesConfigRouteQuery.graphql";

import ModerationPhasesConfigContainer from "./ModerationPhasesConfigContainer";

interface Props {
  data: ModerationPhasesConfigRouteQueryResponse | null;
}

const ModerationPhasesConfigRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  return <ModerationPhasesConfigContainer settings={data.settings} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ModerationPhasesConfigRouteQuery {
      settings {
        ...ModerationPhasesConfigContainer_settings
      }
    }
  `,
})(ModerationPhasesConfigRoute);

export default enhanced;
