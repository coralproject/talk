import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import getExternalModerationPhaseLink from "coral-admin/helpers/getExternalModerationPhaseLink";
import {
  Button,
  Flex,
  Icon,
  TableCell,
  TableRow,
} from "coral-ui/components/v2";

import { ExternalModerationPhaseRow_phase$key as ExternalModerationPhaseRow_phase } from "coral-admin/__generated__/ExternalModerationPhaseRow_phase.graphql";

import StatusMarker from "./StatusMarker";

import styles from "./ExternalModerationPhaseRow.css";

interface Props {
  phase: ExternalModerationPhaseRow_phase;
}

const ExternalModerationPhaseRow: FunctionComponent<Props> = ({ phase }) => {
  const phaseData = useFragment(
    graphql`
      fragment ExternalModerationPhaseRow_phase on ExternalModerationPhase {
        id
        name
        enabled
      }
    `,
    phase
  );

  return (
    <TableRow data-testid={`moderation-phase-${phaseData.id}`}>
      <TableCell className={styles.urlColumn}>{phaseData.name}</TableCell>
      <TableCell>
        <StatusMarker enabled={phaseData.enabled} />
      </TableCell>
      <TableCell>
        <Flex justifyContent="flex-end">
          <Localized
            id="configure-moderationPhases-detailsButton"
            icon={<Icon>keyboard_arrow_right</Icon>}
          >
            <Button
              variant="text"
              to={getExternalModerationPhaseLink(phaseData.id)}
              iconRight
            >
              Details
              <Icon>keyboard_arrow_right</Icon>
            </Button>
          </Localized>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

export default ExternalModerationPhaseRow;
