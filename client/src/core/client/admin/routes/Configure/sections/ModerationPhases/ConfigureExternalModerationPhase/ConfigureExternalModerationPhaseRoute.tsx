import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { CallOut, Delay, Spinner } from "coral-ui/components/v2";

import { ConfigureExternalModerationPhaseRouteQueryResponse } from "coral-admin/__generated__/ConfigureExternalModerationPhaseRouteQuery.graphql";

import ConfigureExternalModerationPhaseContainer from "./ConfigureExternalModerationPhaseContainer";

interface Props {
  data: ConfigureExternalModerationPhaseRouteQueryResponse | null;
}

const ConfigureExternalModerationPhaseRoute: FunctionComponent<Props> = ({
  data,
}) => {
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  if (!data.externalModerationPhase) {
    return (
      <Localized id="configure-moderationPhases-phaseNotFound">
        <CallOut color="error" fullWidth>
          External moderation phase not found
        </CallOut>
      </Localized>
    );
  }

  return (
    <ConfigureExternalModerationPhaseContainer
      phase={data.externalModerationPhase}
    />
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ConfigureExternalModerationPhaseRouteQuery($phaseID: ID!) {
      externalModerationPhase(id: $phaseID) {
        ...ConfigureExternalModerationPhaseContainer_phase
      }
    }
  `,
  cacheConfig: { force: true },
  prepareVariables: (params, match) => {
    return {
      phaseID: match.params.phaseID,
    };
  },
})(ConfigureExternalModerationPhaseRoute);

export default enhanced;
