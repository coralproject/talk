import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import Subheader from "coral-admin/routes/Configure/Subheader";
import { CopyButton } from "coral-framework/components";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Flex,
  FormField,
  FormFieldDescription,
  HelperText,
  Label,
  PasswordField,
} from "coral-ui/components/v2";

import { ExternalModerationPhaseStatus_phase } from "coral-admin/__generated__/ExternalModerationPhaseStatus_phase.graphql";

import StatusMarker from "../StatusMarker";

interface Props {
  phase: ExternalModerationPhaseStatus_phase;
}

const ExternalModerationPhaseStatus: FunctionComponent<Props> = ({ phase }) => {
  return (
    <>
      <Localized id="configure-moderationPhases-phaseStatus">
        <Subheader>Phase status</Subheader>
      </Localized>
      <FormField>
        <Localized id="configure-moderationPhases-status">
          <Label>Status</Label>
        </Localized>
        <StatusMarker enabled={phase.enabled} />
      </FormField>
      <FormField>
        <Localized id="configure-moderationPhases-signingSecret">
          <Label>Signing secret</Label>
        </Localized>
        <Localized
          id="configure-moderationPhases-signingSecretDescription"
          externalLink={
            <ExternalLink href="https://github.com/coralproject/talk/blob/main/EXTERNAL_MODERATION_PHASES.md#request-signing" />
          }
        >
          <FormFieldDescription>
            The following signing secret is used to sign request payloads sent
            to the URL. To learn more about webhook signing, visit our{" "}
            <ExternalLink href="https://github.com/coralproject/talk/blob/main/EXTERNAL_MODERATION_PHASES.md#request-signing">
              docs
            </ExternalLink>
            .
          </FormFieldDescription>
        </Localized>
        <Flex direction="row" itemGutter="half" alignItems="center">
          <PasswordField
            value={phase.signingSecret.secret}
            fullWidth
            readOnly
          />
          <CopyButton text={phase.signingSecret.secret} />
        </Flex>
        <Localized
          id="configure-moderationPhases-generatedAt"
          $date={new Date(phase.signingSecret.createdAt)}
        >
          <HelperText>
            KEY GENERATED AT: {phase.signingSecret.createdAt}
          </HelperText>
        </Localized>
      </FormField>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  phase: graphql`
    fragment ExternalModerationPhaseStatus_phase on ExternalModerationPhase {
      id
      enabled
      signingSecret {
        secret
        createdAt
      }
    }
  `,
})(ExternalModerationPhaseStatus);

export default enhanced;
