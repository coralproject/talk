import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import getExternalModerationPhaseLink from "coral-admin/helpers/getExternalModerationPhaseLink";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ArrowRightIcon, SvgIcon } from "coral-ui/components/icons";
import { Button, Flex, TableCell, TableRow } from "coral-ui/components/v2";

import { ExternalModerationPhaseRow_phase } from "coral-admin/__generated__/ExternalModerationPhaseRow_phase.graphql";

import StatusMarker from "./StatusMarker";

import styles from "./ExternalModerationPhaseRow.css";

interface Props {
  phase: ExternalModerationPhaseRow_phase;
}

const ExternalModerationPhaseRow: FunctionComponent<Props> = ({ phase }) => (
  <TableRow data-testid={`moderation-phase-${phase.id}`}>
    <TableCell className={styles.urlColumn}>{phase.name}</TableCell>
    <TableCell>
      <StatusMarker enabled={phase.enabled} />
    </TableCell>
    <TableCell>
      <Flex justifyContent="flex-end">
        <Localized
          id="configure-moderationPhases-detailsButton"
          elems={{
            icon: (
              <SvgIcon
                Icon={ArrowRightIcon}
                className={styles.detailsIcon}
                size="xxs"
              />
            ),
          }}
        >
          <Button
            variant="text"
            to={getExternalModerationPhaseLink(phase.id)}
            iconRight
          >
            Details
            <SvgIcon
              Icon={ArrowRightIcon}
              className={styles.detailsIcon}
              size="xxs"
            />
          </Button>
        </Localized>
      </Flex>
    </TableCell>
  </TableRow>
);

const enhanced = withFragmentContainer<Props>({
  phase: graphql`
    fragment ExternalModerationPhaseRow_phase on ExternalModerationPhase {
      id
      name
      enabled
    }
  `,
})(ExternalModerationPhaseRow);

export default enhanced;
