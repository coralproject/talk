import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ConfigureExternalModerationPhaseContainer_phase$key as ConfigureExternalModerationPhaseContainer_phase } from "coral-admin/__generated__/ConfigureExternalModerationPhaseContainer_phase.graphql";

import ExperimentalExternalModerationPhaseCallOut from "../ExperimentalExternalModerationPhaseCallOut";
import ExternalModerationPhaseDangerZone from "./ExternalModerationPhaseDangerZone";
import ExternalModerationPhaseDetails from "./ExternalModerationPhaseDetails";
import ExternalModerationPhaseStatus from "./ExternalModerationPhaseStatus";

interface Props {
  phase: ConfigureExternalModerationPhaseContainer_phase;
}

const ConfigureExternalModerationPhaseContainer: FunctionComponent<Props> = ({
  phase,
}) => {
  const phaseData = useFragment(
    graphql`
      fragment ConfigureExternalModerationPhaseContainer_phase on ExternalModerationPhase {
        ...ExternalModerationPhaseDetails_phase
        ...ExternalModerationPhaseDangerZone_phase
        ...ExternalModerationPhaseStatus_phase
      }
    `,
    phase
  );

  return (
    <HorizontalGutter
      size="double"
      data-testid="external-moderation-phases-container"
    >
      <ExperimentalExternalModerationPhaseCallOut />
      <ConfigBox
        title={
          <Localized id="configure-moderationPhases-configureExternalModerationPhase">
            <Header htmlFor="configure-moderationPhases-header.title">
              Configure external moderation phase
            </Header>
          </Localized>
        }
      >
        <ExternalModerationPhaseDetails phase={phaseData} />
        <ExternalModerationPhaseStatus phase={phaseData} />
        <ExternalModerationPhaseDangerZone phase={phaseData} />
      </ConfigBox>
    </HorizontalGutter>
  );
};

export default ConfigureExternalModerationPhaseContainer;
