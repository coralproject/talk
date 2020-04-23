import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { ShowIgnoreUserdDialogEvent } from "coral-stream/events";
import { HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { IgnoreUserSettingsContainer_viewer as ViewerData } from "coral-stream/__generated__/IgnoreUserSettingsContainer_viewer.graphql";

import IgnoreUserListItem from "./IgnoreUserListItem";
import RemoveUserIgnoreMutation from "./RemoveUserIgnoreMutation";

import styles from "./IgnoreUserSettingsContainer.css";

interface Props {
  viewer: ViewerData;
}

const IgnoreUserSettingsContainer: FunctionComponent<Props> = ({ viewer }) => {
  const emitShow = useViewerEvent(ShowIgnoreUserdDialogEvent);
  const removeUserIgnore = useMutation(RemoveUserIgnoreMutation);
  const [showManage, setShowManage] = useState(false);
  const toggleManage = useCallback(() => {
    if (!showManage) {
      emitShow();
    }
    setShowManage((s) => !s);
  }, [showManage, setShowManage]);
  const remove = useCallback(
    async (id: string) => {
      await removeUserIgnore({ userID: id });
    },
    [removeUserIgnore]
  );

  const orderedUsers = viewer.ignoredUsers.concat([]).sort((a, b) => {
    if (!a.username) {
      return -1;
    }
    if (!b.username) {
      return 1;
    }

    return a.username.localeCompare(b.username);
  });

  return (
    <div
      data-testid="profile-account-ignoredCommenters"
      className={cn(styles.root, CLASSES.ignoredCommenters.$root)}
    >
      <Localized id="profile-account-ignoredCommenters">
        <div className={styles.title}>Ignored Commenters</div>
      </Localized>
      <div className={styles.description}>
        You can ignore other commenters by clicking on their username and
        selecting Ignore. When you ignore someone, all of their comments are
        hidden from you. Commenters you Ignore will still be able to see your
        comments.
      </div>
      {showManage && (
        <Localized id="profile-account-ignoredCommenters-close">
          <Button
            variant="filled"
            color="secondary"
            upperCase
            onClick={toggleManage}
            className={CLASSES.ignoredCommenters.manageButton}
          >
            Close
          </Button>
        </Localized>
      )}
      {!showManage && (
        <Localized id="profile-account-ignoredCommenters-manage">
          <Button
            variant="outlined"
            color="secondary"
            upperCase
            onClick={toggleManage}
            className={cn(
              styles.manageButton,
              CLASSES.ignoredCommenters.manageButton
            )}
          >
            Manage
          </Button>
        </Localized>
      )}
      {showManage && (
        <HorizontalGutter
          spacing={1}
          className={cn(styles.list, CLASSES.ignoredCommenters.list)}
        >
          {orderedUsers.map((user) => (
            <IgnoreUserListItem
              key={user.id}
              id={user.id}
              username={user.username}
              onRemove={remove}
            />
          ))}
          {orderedUsers.length === 0 && (
            <Localized id="profile-account-ignoredCommenters-empty">
              <div className={styles.empty}>
                You are not currently ignoring anyone
              </div>
            </Localized>
          )}
        </HorizontalGutter>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment IgnoreUserSettingsContainer_viewer on User {
      ignoredUsers {
        id
        username
      }
    }
  `,
})(IgnoreUserSettingsContainer);

export default enhanced;
