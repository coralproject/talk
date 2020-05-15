import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SCHEDULED_DELETION_WINDOW_DURATION } from "coral-common/constants";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import CancelAccountDeletionMutation from "coral-stream/mutations/CancelAccountDeletionMutation";
import { HorizontalGutter, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { StreamDeletionRequestCalloutContainer_viewer } from "coral-stream/__generated__/StreamDeletionRequestCalloutContainer_viewer.graphql";

import styles from "./StreamDeletionRequestCalloutContainer.css";

interface Props {
  viewer: StreamDeletionRequestCalloutContainer_viewer;
}

const formatter = (locales: string[], date: Date) =>
  Intl.DateTimeFormat(locales, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);

const subtractSeconds = (date: Date, seconds: number) => {
  return new Date(date.getTime() - seconds * 1000);
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
        subtractSeconds(
          new Date(viewer.scheduledDeletionDate),
          SCHEDULED_DELETION_WINDOW_DURATION
        )
      )
    : null;

  return (
    <>
      {deletionDate && (
        <CallOut
          color="negative"
          className={CLASSES.pendingAccountDeletion.$root}
          borderPosition="top"
          iconColor="inherit"
          icon={
            <Icon size="sm" className={styles.icon}>
              error
            </Icon>
          }
          iconPosition="left"
          title={
            <Localized id="comments-stream-deleteAccount-callOut-title">
              Account deletion requested
            </Localized>
          }
        >
          <HorizontalGutter className={styles.gutter}>
            <Localized
              id="comments-stream-deleteAccount-callOut-receivedDesc"
              $date={requestDate}
            >
              <div>
                A request to delete your account was received on {requestDate}.
              </div>
            </Localized>
          </HorizontalGutter>
          <HorizontalGutter className={styles.gutter}>
            <Localized
              id="comments-stream-deleteAccount-callOut-cancelDesc"
              $date={deletionDate}
            >
              <div>
                If you would like to continue leaving comments, replies or
                reactions, you may cancel your request to delete your account
                before {deletionDate}.
              </div>
            </Localized>
          </HorizontalGutter>
          <HorizontalGutter className={styles.gutter}>
            <Localized id="comments-stream-deleteAccount-callOut-cancelAccountDeletion">
              <Button
                variant="filled"
                paddingSize="extraSmall"
                fontSize="small"
                upperCase
                color="secondary"
                onClick={cancelDeletion}
                className={CLASSES.pendingAccountDeletion.cancelRequestButton}
              >
                Cancel account deletion
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
