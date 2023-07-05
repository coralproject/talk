import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import CancelAccountDeletionMutation from "coral-stream/mutations/CancelAccountDeletionMutation";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

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
    void cancelAccountDeletion();
  }, [cancelAccountDeletion]);

  const formatter = useDateTimeFormatter({
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const deletionDate = viewer.scheduledDeletionDate
    ? formatter(viewer.scheduledDeletionDate)
    : null;

  return (
    <section
      className={cn(styles.root, CLASSES.deleteMyAccount.$root)}
      aria-labelledby="profile-account-deleteAccount-title"
    >
      <DeleteAccountModal
        open={deletePopoverVisible}
        onClose={hidePopover}
        userID={viewer.id}
        scheduledDeletionDate={viewer.scheduledDeletionDate}
        organizationEmail={settings.organization.contactEmail}
      />
      <div data-testid="profile-account-deleteAccount">
        <div className={cn(styles.content, CLASSES.deleteMyAccount.content)}>
          <Localized id="profile-account-deleteAccount-deleteMyAccount">
            <div
              className={cn(styles.title, CLASSES.deleteMyAccount.title)}
              id="profile-account-deleteAccount-title"
            >
              Delete my account
            </div>
          </Localized>
          <Localized id="profile-account-deleteAccount-description">
            <div
              className={cn(styles.section, CLASSES.deleteMyAccount.section)}
            >
              Deleting your account will permanently erase your profile and
              remove all your comments from this site.
            </div>
          </Localized>
          {deletionDate && (
            <>
              <Localized
                id="profile-account-deleteAccount-cancelDelete-description"
                vars={{ date: deletionDate }}
              >
                <div
                  className={cn(
                    styles.section,
                    CLASSES.deleteMyAccount.section
                  )}
                >
                  You have already submitted a request to delete your account.
                  Your account will be deleted on {deletionDate}. You may cancel
                  the request until that time.
                </div>
              </Localized>
              <Button
                variant="filled"
                onClick={cancelDeletion}
                className={CLASSES.deleteMyAccount.cancelRequestButton}
              >
                <Flex alignItems="center">
                  <Icon size="sm" className={styles.icon}>
                    block
                  </Icon>
                  <Localized id="profile-account-deleteAccount-cancelDelete">
                    <span>Cancel account deletion request</span>
                  </Localized>
                </Flex>
              </Button>
            </>
          )}
        </div>

        {!deletionDate && (
          <Localized id="profile-account-deleteAccount-request">
            <Button
              color="error"
              variant="filled"
              className={cn(
                styles.requestButton,
                CLASSES.deleteMyAccount.requestButton
              )}
              onClick={showPopover}
              upperCase
            >
              Request
            </Button>
          </Localized>
        )}
      </div>
    </section>
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
