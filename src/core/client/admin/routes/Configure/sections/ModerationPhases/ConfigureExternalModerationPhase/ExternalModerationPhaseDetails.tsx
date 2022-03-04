import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import Subheader from "coral-admin/routes/Configure/Subheader";

import { ExternalModerationPhaseDetails_phase$key as ExternalModerationPhaseDetails_phase } from "coral-admin/__generated__/ExternalModerationPhaseDetails_phase.graphql";

import ConfigureExternalModerationPhaseForm from "../ConfigureExternalModerationPhaseForm";

interface Props {
  phase: ExternalModerationPhaseDetails_phase;
}

const ExternalModerationPhaseDetails: FunctionComponent<Props> = ({
  phase,
}) => {
  const phaseData = useFragment(
    graphql`
      fragment ExternalModerationPhaseDetails_phase on ExternalModerationPhase {
        ...ConfigureExternalModerationPhaseForm_phase
      }
    `,
    phase
  );

  return (
    <>
      <Localized id="configure-moderationPhases-phaseDetails">
        <Subheader>Phase details</Subheader>
      </Localized>
      <ConfigureExternalModerationPhaseForm phase={phaseData} />
    </>
  );
};

export default ExternalModerationPhaseDetails;
