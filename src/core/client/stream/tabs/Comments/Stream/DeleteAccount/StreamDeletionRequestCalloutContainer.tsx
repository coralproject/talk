import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import { SCHEDULED_DELETION_WINDOW_DURATION } from "coral-common/constants";
import { useDateTimeFormatter } from "coral-framework/hooks";
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

const subtractSeconds = (date: Date, seconds: number) => {
  return new Date(date.getTime() - seconds * 1000);
};

const StreamDeletionRequestCalloutContainer: FunctionComponent<Props> = ({
  viewer,
}) => {
  const formatter = useDateTimeFormatter({
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const cancelAccountDeletion = useMutation(CancelAccountDeletionMutation);
  const cancelDeletion = useCallback(() => {
    void cancelAccountDeletion();
  }, [cancelAccountDeletion]);

  const deletionDate = useMemo(
    () =>
      viewer.scheduledDeletionDate
        ? formatter(viewer.scheduledDeletionDate)
        : null,
    [viewer, formatter]
  );

  const requestDate = useMemo(
    () =>
      viewer.scheduledDeletionDate
        ? formatter(
            subtractSeconds(
              new Date(viewer.scheduledDeletionDate),
              SCHEDULED_DELETION_WINDOW_DURATION
            )
          )
        : null,
    [viewer, formatter]
  );

  return (
    <>
      {deletionDate && (
        <CallOut
          container="section"
          color="error"
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
              <div id="comments-stream-deleteAccount-callOut-title">
                Account deletion requested
              </div>
            </Localized>
          }
          aria-labelledby="comments-stream-deleteAccount-callOut-title"
        >
          <HorizontalGutter className={styles.gutter}>
            <Localized
              id="comments-stream-deleteAccount-callOut-receivedDesc"
              vars={{ date: requestDate! }}
            >
              <div>
                A request to delete your account was received on {requestDate}.
              </div>
            </Localized>
          </HorizontalGutter>
          <HorizontalGutter className={styles.gutter}>
            <Localized
              id="comments-stream-deleteAccount-callOut-cancelDesc"
              vars={{ date: deletionDate }}
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
