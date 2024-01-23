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
import { AlertCircleIcon, SvgIcon } from "coral-ui/components/icons";
import { Button, CallOut, ClickOutside, Popover } from "coral-ui/components/v2";

import { DeleteAccountPopoverContainer_user as UserData } from "coral-admin/__generated__/DeleteAccountPopoverContainer_user.graphql";

import CancelScheduledAccountDeletionMutation from "./CancelScheduledAccountDeletionMutation";
import DeleteAccountPopover from "./DeleteAccountPopover";

import styles from "./DeleteAccountPopoverContainer.css";

interface Props {
  user: UserData;
}

const DeleteAccountPopoverContainer: FunctionComponent<Props> = ({ user }) => {
  const cancelScheduledAccountDeletion = useMutation(
    CancelScheduledAccountDeletionMutation
  );
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

  const onCancelScheduledDeletion = useCallback(async () => {
    try {
      await cancelScheduledAccountDeletion({ userID: user.id });
    } catch (e) {
      if (e.message) {
        setCancelDeletionError(e.message as string);
      }
    }
  }, [user.id, cancelScheduledAccountDeletion, setCancelDeletionError]);

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
            Cancel user deletion
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
    <Localized
      id="moderate-user-drawer-deleteAccount-popover"
      attrs={{ description: true }}
    >
      <Popover
        id="moderate-user-drawer-deleteAccount"
        placement="right-start"
        description="A popover menu to delete a user's account"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <DeleteAccountPopover
              onDismiss={toggleVisibility}
              userID={user.id}
              username={user.username}
            />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref }) => (
          <Localized
            id="moderate-user-drawer-deleteAccount-button"
            attrs={{ "aria-label": true }}
          >
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
