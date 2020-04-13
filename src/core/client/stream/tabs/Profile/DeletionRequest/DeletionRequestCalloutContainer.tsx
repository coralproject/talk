import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import CancelAccountDeletionMutation from "coral-stream/mutations/CancelAccountDeletionMutation";
import { Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { DeletionRequestCalloutContainer_viewer } from "coral-stream/__generated__/DeletionRequestCalloutContainer_viewer.graphql";

import styles from "./DeletionRequestCalloutContainer.css";

interface Props {
  viewer: DeletionRequestCalloutContainer_viewer;
}

const DeletionRequestCalloutContainer: FunctionComponent<Props> = ({
  viewer,
}) => {
  if (!viewer.scheduledDeletionDate) {
    return null;
  }

  const cancelDeletionMutation = useMutation(CancelAccountDeletionMutation);
  const cancelDeletion = useCallback(() => {
    cancelDeletionMutation();
  }, [cancelDeletionMutation]);

  const { locales } = useCoralContext();

  const deletionDate = viewer.scheduledDeletionDate
    ? Intl.DateTimeFormat(locales, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date(viewer.scheduledDeletionDate))
    : null;

  return (
    <div
      className={cn(styles.container, CLASSES.pendingAccountDeletion.container)}
    >
      <CallOut
        color="alert"
        borderPosition="top"
        className={CLASSES.pendingAccountDeletion.$root}
      >
        <HorizontalGutter>
          <Flex>
            <Icon
              size="sm"
              className={cn(CLASSES.pendingAccountDeletion.icon, styles.icon)}
            >
              timer
            </Icon>
            <div>
              <Localized
                id="profile-accountDeletion-deletionDesc"
                $date={deletionDate}
              >
                <div>
                  Your account is scheduled to be deleted on {deletionDate}.
                </div>
              </Localized>
              <Localized id="profile-accountDeletion-cancelAccountDeletion">
                <Button
                  className={cn(
                    styles.cancelButton,
                    CLASSES.pendingAccountDeletion.cancelRequestButton
                  )}
                  variant="filled"
                  color="mono"
                  marginSize="none"
                  upperCase
                  onClick={cancelDeletion}
                >
                  Cancel account deletion
                </Button>
              </Localized>
            </div>
          </Flex>
        </HorizontalGutter>
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
