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
import { AlertTriangleIcon, SvgIcon } from "coral-ui/components/icons";
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

  const formatter = useDateTimeFormatter({
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const onRequestDeletion = useCallback(async () => {
    await scheduleAccountDeletion({ userID: user.id });
    // TODO: Handle error message
  }, [user.id, scheduleAccountDeletion]);

  const onCancelScheduledDeletion = useCallback(async () => {
    await cancelScheduledAccountDeletion({ userID: user.id });
  }, [user.id, cancelScheduledAccountDeletion]);

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
        <Localized id="">
          <div className={styles.deletionCalloutTitle}>
            User deletion activated
          </div>
        </Localized>
        <Localized id="">
          <div>This will occur at {deletionDate}.</div>
        </Localized>
        <Localized id="">
          <Button
            className={styles.cancelDeletionButton}
            color="mono"
            onClick={onCancelScheduledDeletion}
          >
            Cancel account deletion
          </Button>
        </Localized>
      </CallOut>
    );
  }

  return (
    <Localized id="" attrs={{ description: true }}>
      <Popover
        id=""
        // visible={props.open}
        // placement="bottom-end"
        // description="A popover menu to moderate the comment"
        body={({ toggleVisibility, scheduleUpdate }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <Box className={styles.root} p={3}>
              <>
                <Localized id="">
                  <div className={styles.title}>Delete account</div>
                </Localized>
                {/* TODO: Add styles here */}
                <Localized id="">
                  <div className={styles.header}>Username</div>
                </Localized>
                <div>{user.username}</div>
                <Localized id="">
                  <div className={styles.header}>Delete account will</div>
                </Localized>
                <div>
                  <ol className={styles.orderedList}>
                    <Localized id="">
                      <li>
                        Remove all comments written by this user from the
                        database
                      </li>
                    </Localized>
                    <Localized id="">
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
                  <Localized id="">
                    <span>This entirely removes all records of this user</span>
                  </Localized>
                </CallOut>
                <Localized id="">
                  <div className={styles.moreInfo}>
                    This will go into effect in 24 hours.
                  </div>
                </Localized>
                <Localized
                  id=""
                  // vars={{ text: spamBanConfirmationText }}
                >
                  <div className={styles.header}>
                    Type in "delete" to confirm
                  </div>
                </Localized>
                <input
                  className={styles.confirmationInput}
                  type="text"
                  placeholder=""
                  onChange={onDeleteAccountConfirmationTextInputChange}
                />
                {/* {banError && (
                <div className={styles.error}>
                  <SvgIcon Icon={AlertCircleIcon} className={styles.icon} />
                  {banError}
                </div>
              )} */}
                {/* </> */}
                {/* )} */}
                <Flex
                  justifyContent="flex-end"
                  itemGutter="half"
                  className={styles.actions}
                >
                  <Localized id="">
                    <Button
                      variant="outlined"
                      size="regular"
                      color="mono"
                      onClick={toggleVisibility}
                    >
                      Cancel
                    </Button>
                  </Localized>
                  <Localized id="">
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
        {({ toggleVisibility, visible, ref }) => (
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
