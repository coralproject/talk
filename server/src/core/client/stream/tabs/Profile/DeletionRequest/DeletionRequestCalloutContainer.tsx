import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import CancelAccountDeletionMutation from "coral-stream/mutations/CancelAccountDeletionMutation";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { DeletionRequestCalloutContainer_viewer } from "coral-stream/__generated__/DeletionRequestCalloutContainer_viewer.graphql";

import styles from "./DeletionRequestCalloutContainer.css";

interface Props {
  viewer: DeletionRequestCalloutContainer_viewer;
}

const DeletionRequestCalloutContainer: FunctionComponent<Props> = ({
  viewer,
}) => {
  const cancelDeletionMutation = useMutation(CancelAccountDeletionMutation);
  const cancelDeletion = useCallback(() => {
    void cancelDeletionMutation();
  }, [cancelDeletionMutation]);

  const formatter = useDateTimeFormatter({
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const deletionDate = useMemo(
    () =>
      viewer.scheduledDeletionDate
        ? formatter(viewer.scheduledDeletionDate)
        : null,
    [viewer, formatter]
  );

  if (!viewer.scheduledDeletionDate) {
    return null;
  }

  return (
    <div
      className={cn(styles.container, CLASSES.pendingAccountDeletion.container)}
    >
      <CallOut
        container="section"
        aria-labelledby="profile-accountDeletion-title"
        color="error"
        borderPosition="top"
        className={CLASSES.pendingAccountDeletion.$root}
        icon={
          <Icon size="sm" className={CLASSES.pendingAccountDeletion.icon}>
            timer
          </Icon>
        }
        iconColor="none"
        title={
          <Localized
            id="profile-accountDeletion-deletionDesc"
            vars={{ date: deletionDate ?? "" }}
          >
            <div id="profile-accountDeletion-title">
              Your account is scheduled to be deleted on {deletionDate}.
            </div>
          </Localized>
        }
      >
        <Localized id="profile-accountDeletion-cancelAccountDeletion">
          <Button
            className={cn(
              styles.cancelButton,
              CLASSES.pendingAccountDeletion.cancelRequestButton
            )}
            variant="filled"
            color="secondary"
            paddingSize="none"
            upperCase
            onClick={cancelDeletion}
          >
            Cancel account deletion
          </Button>
        </Localized>
      </CallOut>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment DeletionRequestCalloutContainer_viewer on User {
      scheduledDeletionDate
    }
  `,
})(DeletionRequestCalloutContainer);

export default enhanced;
