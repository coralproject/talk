import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

import CancelAccountDeletionMutation from "coral-stream/mutations/CancelAccountDeletionMutation";

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
    <>
      {deletionDate && (
        <CallOut color="error" fullWidth className={styles.callout}>
          <HorizontalGutter>
            <Flex>
              <Icon size="md" className={styles.icon}>
                report_problem
              </Icon>
              <Localized
                id="profile-accountDeletion-deletionDesc"
                $date={deletionDate}
              >
                <Typography variant="bodyCopy">
                  Your account is scheduled to be deleted on {deletionDate}.
                </Typography>
              </Localized>
            </Flex>
          </HorizontalGutter>
          <HorizontalGutter className={styles.action}>
            <Localized id="profile-accountDeletion-cancelDeletion">
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
    fragment DeletionRequestCalloutContainer_viewer on User {
      scheduledDeletionDate
    }
  `,
})(DeletionRequestCalloutContainer);

export default enhanced;
