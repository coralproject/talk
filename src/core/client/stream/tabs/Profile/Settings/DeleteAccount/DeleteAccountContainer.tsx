import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import CancelAccountDeletionMutation from "coral-stream/mutations/CancelAccountDeletionMutation";
import { Flex, Icon, Typography } from "coral-ui/components";
import { Button } from "coral-ui/components/Button";

import { DeleteAccountContainer_settings } from "coral-stream/__generated__/DeleteAccountContainer_settings.graphql";
import { DeleteAccountContainer_viewer } from "coral-stream/__generated__/DeleteAccountContainer_viewer.graphql";

import DeleteAccountModal from "./DeleteAccountModal";

import styles from "./DeleteAccountContainer.css";

interface Props {
  viewer: DeleteAccountContainer_viewer;
  settings: DeleteAccountContainer_settings;
}

const DeleteAccountContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const cancelAccountDeletion = useMutation(CancelAccountDeletionMutation);

  const [deletePopoverVisible, setDeletePopoverVisible] = useState(false);

  const showPopover = useCallback(() => {
    setDeletePopoverVisible(true);
  }, [setDeletePopoverVisible]);
  const hidePopover = useCallback(() => {
    setDeletePopoverVisible(false);
  }, [setDeletePopoverVisible]);

  const cancelDeletion = useCallback(() => {
    cancelAccountDeletion();
  }, [cancelAccountDeletion]);

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
    <div className={cn(styles.root, CLASSES.deleteMyAccount.$root)}>
      <DeleteAccountModal
        open={deletePopoverVisible}
        onClose={hidePopover}
        userID={viewer.id}
        scheduledDeletionDate={viewer.scheduledDeletionDate}
        organizationEmail={settings.organization.contactEmail}
      />
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        data-testid="profile-account-deleteAccount"
      >
        <div className={styles.content}>
          <Localized id="profile-account-deleteAccount-title">
            <Typography
              variant="heading2"
              color="textDark"
              className={styles.title}
            >
              Delete My Account
            </Typography>
          </Localized>
          <Localized id="profile-account-deleteAccount-description">
            <Typography variant="bodyCopy" className={styles.section}>
              Deleting your account will permanently erase your profile and
              remove all your comments from this site.
            </Typography>
          </Localized>
          {deletionDate && (
            <>
              <Localized
                id="profile-account-deleteAccount-cancelDelete-description"
                $date={deletionDate}
              >
                <Typography variant="bodyCopy" className={styles.section}>
                  You have already submitted a request to delete your account.
                  Your account will be deleted on {deletionDate}. You may cancel
                  the request until that time.
                </Typography>
              </Localized>
              <Button
                variant="filled"
                size="small"
                onClick={cancelDeletion}
                className={CLASSES.deleteMyAccount.cancelRequestButton}
              >
                <Icon size="sm" className={styles.icon}>
                  block
                </Icon>
                <Localized id="profile-account-deleteAccount-cancelDelete">
                  <span>Cancel account deletion request</span>
                </Localized>
              </Button>
            </>
          )}
        </div>

        {!deletionDate && (
          <Localized id="profile-account-deleteAccount-request">
            <Button
              color="primary"
              variant="outlineFilled"
              size="small"
              className={CLASSES.deleteMyAccount.requestButton}
              onClick={showPopover}
            >
              Request
            </Button>
          </Localized>
        )}
      </Flex>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment DeleteAccountContainer_viewer on User {
      id
      scheduledDeletionDate
    }
  `,
  settings: graphql`
    fragment DeleteAccountContainer_settings on Settings {
      organization {
        contactEmail
      }
    }
  `,
})(DeleteAccountContainer);

export default enhanced;
