import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { urls } from "coral-framework/helpers";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Button,
  CallOut,
  FormFieldDescription,
  HorizontalGutter,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import { ModerationPhasesConfigContainer_settings$key as ModerationPhasesConfigContainer_settings } from "coral-admin/__generated__/ModerationPhasesConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import Subheader from "../../Subheader";
import ExperimentalExternalModerationPhaseCallOut from "./ExperimentalExternalModerationPhaseCallOut";
import ExternalModerationPhaseRow from "./ExternalModerationPhaseRow";

interface Props {
  settings: ModerationPhasesConfigContainer_settings;
}

const ModerationPhasesConfigContainer: FunctionComponent<Props> = ({
  settings,
}) => {
  const settingsData = useFragment(
    graphql`
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
    settings
  );

  return (
    <HorizontalGutter size="double" data-testid="moderation-phases-container">
      <ExperimentalExternalModerationPhaseCallOut />
      <ConfigBox
        title={
          <Localized id="configure-moderationPhases-header-title">
            <Header htmlFor="configure-moderationPhases-header.title">
              Moderation Phases
            </Header>
          </Localized>
        }
      >
        <Localized
          id="configure-moderationPhases-description"
          externalLink={
            <ExternalLink href="https://github.com/coralproject/talk/blob/main/EXTERNAL_MODERATION_PHASES.md#request-signing" />
          }
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
          <Icon size="md">add</Icon>
          <Localized id="configure-moderationPhases-addExternalModerationPhaseButton">
            Add external moderation phase
          </Localized>
        </Button>
        <Localized id="configure-moderationPhases-moderationPhases">
          <Subheader>Moderation Phases</Subheader>
        </Localized>
        {settingsData.integrations.external &&
        settingsData.integrations.external.phases.length > 0 ? (
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
              {settingsData.integrations.external.phases.map((phase, idx) => (
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
      </ConfigBox>
    </HorizontalGutter>
  );
};

export default ModerationPhasesConfigContainer;
