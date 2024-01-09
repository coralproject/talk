import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import {
  Box,
  Button,
  CallOut,
  ClickOutside,
  Flex,
  Popover,
} from "coral-ui/components/v2";

import { DeleteAccountPopoverContainer_user as UserData } from "coral-admin/__generated__/DeleteAccountPopoverContainer_user.graphql";

import CancelScheduledAccountDeletionMutation from "./CancelScheduledAccountDeletionMutation";
import ScheduleAccountDeletionMutation from "./ScheduleAccountDeletionMutation";

import styles from "./DeleteAccountPopoverContainer.css";

interface Props {
  user: UserData;
}

const DeleteAccountPopoverContainer: FunctionComponent<Props> = ({ user }) => {
  const scheduleAccountDeletion = useMutation(ScheduleAccountDeletionMutation);
  const cancelScheduledAccountDeletion = useMutation(
    CancelScheduledAccountDeletionMutation
  );
  const [requestDeletionError, setRequestDeletionError] = useState<
    string | null
  >(null);
  const [cancelDeletionError, setCancelDeletionError] = useState<string | null>(
    null
  );

  const formatter = useDateTimeFormatter({
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const onRequestDeletion = useCallback(async () => {
    try {
      await scheduleAccountDeletion({ userID: user.id });
    } catch (e) {
      if (e.message) {
        setRequestDeletionError(e.message);
      }
    }
  }, [user.id, scheduleAccountDeletion, setRequestDeletionError]);

  const onCancelScheduledDeletion = useCallback(async () => {
    try {
      await cancelScheduledAccountDeletion({ userID: user.id });
    } catch (e) {
      if (e.message) {
        setCancelDeletionError(e.message);
      }
    }
  }, [user.id, cancelScheduledAccountDeletion, setCancelDeletionError]);

  const deleteAccountConfirmationText = "delete";
  const [
    deleteAccountConfirmationTextInput,
    setDeleteAccountConfirmationTextInput,
  ] = useState("");

  const onDeleteAccountConfirmationTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDeleteAccountConfirmationTextInput(e.target.value);
    },
    [setDeleteAccountConfirmationTextInput]
  );

  const deleteAccountButtonDisabled = useMemo(() => {
    return !(
      deleteAccountConfirmationTextInput.toLowerCase() ===
      deleteAccountConfirmationText
    );
  }, [deleteAccountConfirmationText, deleteAccountConfirmationTextInput]);

  const deletionDate = useMemo(
    () =>
      user.scheduledDeletionDate ? formatter(user.scheduledDeletionDate) : null,
    [user, formatter]
  );

  if (deletionDate) {
    return (
      <CallOut color="error">
        <Localized id="moderate-user-drawer-deleteAccount-scheduled-callout">
          <div className={styles.deletionCalloutTitle}>
            User deletion activated
          </div>
        </Localized>
        <Localized
          id="moderate-user-drawer-deleteAccount-scheduled-timeframe"
          vars={{ deletionDate }}
        >
          <div className={styles.deletionCalloutInfo}>
            This will occur at {deletionDate}.
          </div>
        </Localized>
        <Localized id="moderate-user-drawer-deleteAccount-scheduled-cancelDeletion">
          <Button
            className={styles.cancelDeletionButton}
            color="mono"
            onClick={onCancelScheduledDeletion}
          >
            Cancel account deletion
          </Button>
        </Localized>
        {cancelDeletionError && (
          <div className={styles.error}>
            {" "}
            <SvgIcon Icon={AlertCircleIcon} className={styles.icon} />
            {cancelDeletionError}
          </div>
        )}
      </CallOut>
    );
  }

  return (
    <Localized id="" attrs={{ description: true }}>
      <Popover
        id=""
        placement="right-start"
        description="A popover menu to delete a user's account"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <Box className={styles.root} p={3}>
              <>
                <Localized id="moderate-user-drawer-deleteAccount-popover-title">
                  <div className={styles.title}>Delete account</div>
                </Localized>
                <Localized id="moderate-user-drawer-deleteAccount-popover-username">
                  <div className={styles.header}>Username</div>
                </Localized>
                <div className={styles.username}>{user.username}</div>
                <Localized id="moderate-user-drawer-deleteAccount-popover-header-description">
                  <div className={styles.header}>Delete account will</div>
                </Localized>
                <div>
                  <ol className={styles.orderedList}>
                    <Localized id="moderate-user-drawer-deleteAccount-popover-description-list-removeComments">
                      <li>
                        Remove all comments written by this user from the
                        database
                      </li>
                    </Localized>
                    <Localized id="moderate-user-drawer-deleteAccount-popover-description-list-deleteAll">
                      <li>
                        Delete all record of this account. The user could then
                        create a new account using the same email address. If
                        you want to Ban this user instead and retain their
                        history, press 'CANCEL' and use the Status dropdown
                        below the username.
                      </li>
                    </Localized>
                  </ol>
                </div>
                <CallOut
                  className={styles.callOut}
                  color="error"
                  fullWidth
                  borderless
                >
                  <SvgIcon
                    size="xs"
                    className={styles.icon}
                    Icon={AlertTriangleIcon}
                  />
                  <Localized id="moderate-user-drawer-deleteAccount-popover-callout">
                    <span>This entirely removes all records of this user</span>
                  </Localized>
                </CallOut>
                <Localized id="moderate-user-drawer-deleteAccount-popover-timeframe">
                  <div className={styles.moreInfo}>
                    This will go into effect in 24 hours.
                  </div>
                </Localized>
                <Localized
                  id="moderate-user-drawer-deleteAccount-popover-confirm"
                  vars={{ text: deleteAccountConfirmationText }}
                >
                  <div className={styles.header}>
                    Type in "{deleteAccountConfirmationText}" to confirm
                  </div>
                </Localized>
                <input
                  className={styles.confirmationInput}
                  type="text"
                  placeholder=""
                  onChange={onDeleteAccountConfirmationTextInputChange}
                />
                {requestDeletionError && (
                  <div className={styles.error}>
                    <SvgIcon Icon={AlertCircleIcon} className={styles.icon} />
                    {requestDeletionError}
                  </div>
                )}
                <Flex
                  justifyContent="flex-end"
                  itemGutter="half"
                  className={styles.actions}
                >
                  <Localized id="moderate-user-drawer-deleteAccount-popover-cancelButton">
                    <Button
                      variant="outlined"
                      size="regular"
                      color="mono"
                      onClick={toggleVisibility}
                    >
                      Cancel
                    </Button>
                  </Localized>
                  <Localized id="moderate-user-drawer-deleteAccount-popover-deleteButton">
                    <Button
                      disabled={deleteAccountButtonDisabled}
                      variant="regular"
                      size="regular"
                      color="alert"
                      onClick={onRequestDeletion}
                    >
                      Delete
                    </Button>
                  </Localized>
                </Flex>
              </>
            </Box>
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref }) => (
          <Localized id="" attrs={{ "aria-label": true }}>
            <Button color="alert" ref={ref} onClick={toggleVisibility}>
              Delete account
            </Button>
          </Localized>
        )}
      </Popover>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment DeleteAccountPopoverContainer_user on User {
      id
      username
      scheduledDeletionDate
    }
  `,
})(DeleteAccountPopoverContainer);

export default enhanced;
