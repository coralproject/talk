import { Localized } from "fluent-react/compat";
import { DateTime } from "luxon";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SCHEDULED_DELETION_TIMESPAN_DAYS } from "coral-common/constants";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

import CancelAccountDeletionMutation from "coral-stream/mutations/CancelAccountDeletionMutation";

import { StreamDeletionRequestCalloutContainer_viewer } from "coral-stream/__generated__/StreamDeletionRequestCalloutContainer_viewer.graphql";

import styles from "./StreamDeletionRequestCalloutContainer.css";

interface Props {
  viewer: StreamDeletionRequestCalloutContainer_viewer;
}

const formatter = (locales: string[], date: Date) => {
  return Intl.DateTimeFormat(locales, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);
};

const StreamDeletionRequestCalloutContainer: FunctionComponent<Props> = ({
  viewer,
}) => {
  const { locales } = useCoralContext();

  const cancelAccountDeletion = useMutation(CancelAccountDeletionMutation);
  const cancelDeletion = useCallback(() => {
    cancelAccountDeletion();
  }, [cancelAccountDeletion]);

  const deletionDate = viewer.scheduledDeletionDate
    ? formatter(locales, new Date(viewer.scheduledDeletionDate))
    : null;

  const requestDate = viewer.scheduledDeletionDate
    ? formatter(
        locales,
        DateTime.fromISO(viewer.scheduledDeletionDate)
          .minus({ days: SCHEDULED_DELETION_TIMESPAN_DAYS })
          .toJSDate()
      )
    : null;

  return (
    <>
      {deletionDate && (
        <CallOut color="error">
          <HorizontalGutter className={styles.gutter}>
            <Flex>
              <Icon size="md" className={styles.icon}>
                report_problem
              </Icon>
              <Localized id="comments-stream-deleteAccount-callOut-title">
                <Typography variant="bodyCopyBold">
                  Account deletion requested
                </Typography>
              </Localized>
            </Flex>
          </HorizontalGutter>
          <HorizontalGutter className={styles.gutter}>
            <Localized
              id="comments-stream-deleteAccount-callOut-receivedDesc"
              $date={requestDate}
            >
              <Typography variant="bodyCopy">
                A request to delete your account was received on {requestDate}.
              </Typography>
            </Localized>
          </HorizontalGutter>
          <HorizontalGutter className={styles.gutter}>
            <Localized
              id="comments-stream-deleteAccount-callOut-cancelDesc"
              $date={deletionDate}
            >
              <Typography variant="bodyCopy">
                If you would like to continue leaving comments, replies or
                reactions, you may cancel your request to delete your account
                before {deletionDate}.
              </Typography>
            </Localized>
          </HorizontalGutter>
          <HorizontalGutter className={styles.gutter}>
            <Localized id="comments-stream-deleteAccount-callOut-cancel">
              <Button
                variant="underlined"
                color="primary"
                onClick={cancelDeletion}
              >
                Cancel account deletion request
              </Button>
            </Localized>
          </HorizontalGutter>
        </CallOut>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment StreamDeletionRequestCalloutContainer_viewer on User {
      scheduledDeletionDate
    }
  `,
})(StreamDeletionRequestCalloutContainer);

export default enhanced;
