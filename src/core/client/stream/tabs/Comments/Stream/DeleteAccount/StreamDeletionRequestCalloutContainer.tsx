import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SCHEDULED_DELETION_TIMESPAN_DAYS } from "coral-common/constants";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import CancelAccountDeletionMutation from "coral-stream/mutations/CancelAccountDeletionMutation";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

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

const subtractDays = (date: Date, days: number) => {
  const millisecondsInADay = 86400000;
  return new Date(date.getTime() - days * millisecondsInADay);
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
        subtractDays(
          new Date(viewer.scheduledDeletionDate),
          SCHEDULED_DELETION_TIMESPAN_DAYS
        )
      )
    : null;

  return (
    <>
      {deletionDate && (
        <CallOut color="error" className={CLASSES.pendingAccountDeletion.$root}>
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
                className={CLASSES.pendingAccountDeletion.cancelRequestButton}
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
