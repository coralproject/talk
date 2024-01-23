import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";

import { useMutation } from "coral-framework/lib/relay";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import { Box, Button, CallOut, Flex } from "coral-ui/components/v2";

import ScheduleAccountDeletionMutation from "./ScheduleAccountDeletionMutation";

import styles from "./DeleteAccountPopover.css";

interface Props {
  onDismiss: () => void;
  userID: string;
  username: string | null;
}

const DeleteAccountPopover: FunctionComponent<Props> = ({
  onDismiss,
  userID,
  username,
}) => {
  const scheduleAccountDeletion = useMutation(ScheduleAccountDeletionMutation);
  const [requestDeletionError, setRequestDeletionError] = useState<
    string | null
  >(null);

  const onRequestDeletion = useCallback(async () => {
    try {
      await scheduleAccountDeletion({ userID });
    } catch (e) {
      if (e.message) {
        setRequestDeletionError(e.message as string);
      }
    }
  }, [userID, scheduleAccountDeletion, setRequestDeletionError]);

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

  return (
    <Box className={styles.root} p={3}>
      <>
        <Localized id="moderate-user-drawer-deleteAccount-popover-title">
          <div className={styles.title}>Delete account</div>
        </Localized>
        <Localized id="moderate-user-drawer-deleteAccount-popover-username">
          <div className={styles.header}>Username</div>
        </Localized>
        <div className={styles.username}>{username ?? ""}</div>
        <Localized id="moderate-user-drawer-deleteAccount-popover-header-description">
          <div className={styles.header}>Delete account will</div>
        </Localized>
        <div>
          <ol className={styles.orderedList}>
            <Localized id="moderate-user-drawer-deleteAccount-popover-description-list-removeComments">
              <li>
                Remove all comments written by this user from the database.
              </li>
            </Localized>
            <Localized id="moderate-user-drawer-deleteAccount-popover-description-list-deleteAll">
              <li>
                Delete all record of this account. The user could then create a
                new account using the same email address. If you want to Ban
                this user instead and retain their history, press "CANCEL" and
                use the Status dropdown below the username.
              </li>
            </Localized>
          </ol>
        </div>
        <CallOut className={styles.callOut} color="error" fullWidth borderless>
          <SvgIcon size="xs" className={styles.icon} Icon={AlertTriangleIcon} />
          <Localized id="moderate-user-drawer-deleteAccount-popover-callout">
            <span>This removes all records of this user</span>
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
              onClick={onDismiss}
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
  );
};

export default DeleteAccountPopover;
