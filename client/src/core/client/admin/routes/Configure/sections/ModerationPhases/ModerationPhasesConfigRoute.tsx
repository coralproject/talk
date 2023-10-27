import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { ModerationPhasesConfigRoute_local } from "coral-admin/__generated__/ModerationPhasesConfigRoute_local.graphql";
import { ModerationPhasesConfigRouteQueryResponse } from "coral-admin/__generated__/ModerationPhasesConfigRouteQuery.graphql";

import { useLocal } from "coral-framework/lib/relay";
import ModerationPhasesConfigContainer from "./ModerationPhasesConfigContainer";

interface Props {
  data: ModerationPhasesConfigRouteQueryResponse | null;
}

const ModerationPhasesConfigRoute: FunctionComponent<Props> = ({ data }) => {
  const [{ dsaFeaturesEnabled }] =
    useLocal<ModerationPhasesConfigRoute_local>(graphql`
      fragment ModerationPhasesConfigRoute_local on Local {
        dsaFeaturesEnabled
      }
    `);
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  // TODO (marcushaddon): if dsaEnabled, show message
  if (dsaFeaturesEnabled) {
    return <h1>TODO: message explaining</h1>;
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
