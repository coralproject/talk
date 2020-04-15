import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import Subheader from "coral-admin/routes/Configure/Subheader";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { ExternalModerationPhaseDetails_phase } from "coral-admin/__generated__/ExternalModerationPhaseDetails_phase.graphql";

import ConfigureExternalModerationPhaseForm from "../ConfigureExternalModerationPhaseForm";

interface Props {
  phase: ExternalModerationPhaseDetails_phase;
}

const ExternalModerationPhaseDetails: FunctionComponent<Props> = ({
  phase,
}) => (
  <>
    <Localized id="configure-moderationPhases-phaseDetails">
      <Subheader>Phase details</Subheader>
    </Localized>
    <ConfigureExternalModerationPhaseForm phase={phase} />
  </>
);

const enhanced = withFragmentContainer<Props>({
  phase: graphql`
    fragment ExternalModerationPhaseDetails_phase on ExternalModerationPhase {
      ...ConfigureExternalModerationPhaseForm_phase
    }
  `,
})(ExternalModerationPhaseDetails);

export default enhanced;
