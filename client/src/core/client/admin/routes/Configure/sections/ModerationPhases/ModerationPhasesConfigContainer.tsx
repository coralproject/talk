import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { urls } from "coral-framework/helpers";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { AddIcon, SvgIcon } from "coral-ui/components/icons";
import {
  Button,
  CallOut,
  FormFieldDescription,
  HorizontalGutter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import { ModerationPhasesConfigContainer_local } from "coral-admin/__generated__/ModerationPhasesConfigContainer_local.graphql";
import { ModerationPhasesConfigContainer_settings } from "coral-admin/__generated__/ModerationPhasesConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import Subheader from "../../Subheader";
import ExperimentalExternalModerationPhaseCallOut from "./ExperimentalExternalModerationPhaseCallOut";
import ExternalModerationPhaseRow from "./ExternalModerationPhaseRow";

interface Props {
  settings: ModerationPhasesConfigContainer_settings;
}

const ModerationPhasesBox: FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ConfigBox
    title={
      <Localized id="configure-moderationPhases-header-title">
        <Header htmlFor="configure-moderationPhases-header.title">
          Moderation Phases
        </Header>
      </Localized>
    }
  >
    {children}
  </ConfigBox>
);

const ModerationPhasesConfigContainer: FunctionComponent<Props> = ({
  settings,
}) => {
  const [{ dsaFeaturesEnabled }] =
    useLocal<ModerationPhasesConfigContainer_local>(graphql`
      fragment ModerationPhasesConfigContainer_local on Local {
        dsaFeaturesEnabled
      }
    `);

  if (dsaFeaturesEnabled) {
    return (
      <ModerationPhasesBox>
        <Localized id="configure-moderationPhases-dsaEnabled">
          <CallOut color="error" fullWidth>
            You currently have DSA features enabled. External moderation is not
            currently DSA compliant, and so is disabled.
          </CallOut>
        </Localized>
      </ModerationPhasesBox>
    );
  }

  return (
    <HorizontalGutter size="double" data-testid="moderation-phases-container">
      <ExperimentalExternalModerationPhaseCallOut />
      <ModerationPhasesBox>
        <Localized
          id="configure-moderationPhases-description"
          elems={{
            externalLink: (
              <ExternalLink href="https://github.com/coralproject/talk/blob/main/EXTERNAL_MODERATION_PHASES.md#request-signing" />
            ),
          }}
        >
          <FormFieldDescription>
            Configure a external moderation phase to automate some moderation
            actions. Moderation requests will be JSON encoded and signed. To
            learn more about moderation requests, visit our{" "}
            <ExternalLink href="https://github.com/coralproject/talk/blob/main/EXTERNAL_MODERATION_PHASES.md#request-signing">
              docs
            </ExternalLink>
            .
          </FormFieldDescription>
        </Localized>
        <Button
          to={urls.admin.addExternalModerationPhase}
          iconLeft
          data-testid="add-external-moderation-phase"
        >
          <SvgIcon Icon={AddIcon} size="xs" />
          <Localized id="configure-moderationPhases-addExternalModerationPhaseButton">
            Add external moderation phase
          </Localized>
        </Button>
        <Localized id="configure-moderationPhases-moderationPhases">
          <Subheader>Moderation Phases</Subheader>
        </Localized>
        {settings.integrations.external &&
        settings.integrations.external.phases.length > 0 ? (
          <Table fullWidth>
            <TableHead>
              <TableRow>
                <Localized id="configure-moderationPhases-name">
                  <TableCell>Name</TableCell>
                </Localized>
                <Localized id="configure-moderationPhases-status">
                  <TableCell>Status</TableCell>
                </Localized>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.integrations.external.phases.map((phase, idx) => (
                <ExternalModerationPhaseRow key={idx} phase={phase} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <Localized id="configure-moderationPhases-noExternalModerationPhases">
            <CallOut color="regular" fullWidth>
              There are no external moderation phases configured, add one above.
            </CallOut>
          </Localized>
        )}
      </ModerationPhasesBox>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ModerationPhasesConfigContainer_settings on Settings {
      integrations {
        external {
          phases {
            ...ExternalModerationPhaseRow_phase
          }
        }
      }
    }
  `,
})(ModerationPhasesConfigContainer);

export default enhanced;
