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
  }, [showManage, setShowManage, emitShow]);
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
    <section
      data-testid="profile-account-ignoredCommenters"
      className={cn(styles.root, CLASSES.ignoredCommenters.$root)}
      aria-labelledby="profile-account-ignoredCommenters-title"
    >
      <Localized id="profile-account-ignoredCommenters">
        <h2
          className={cn(styles.title, CLASSES.ignoredCommenters.heading)}
          id="profile-account-ignoredCommenters-title"
        >
          Ignored Commenters
        </h2>
      </Localized>
      <Localized id="profile-account-ignoredCommenters-description">
        <div className={styles.description}>
          You can ignore other commenters by clicking on their username and
          selecting Ignore. When you ignore someone, all of their comments are
          hidden from you. Commenters you Ignore will still be able to see your
          comments.
        </div>
      </Localized>
      {showManage && (
        <Localized
          id="profile-account-ignoredCommenters-close"
          key="toggleButton"
        >
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
        <Localized
          id="profile-account-ignoredCommenters-manage"
          key="toggleButton"
          attrs={{ "aria-label": true }}
        >
          <Button
            variant="outlined"
            color="secondary"
            upperCase
            onClick={toggleManage}
            className={cn(
              styles.manageButton,
              CLASSES.ignoredCommenters.manageButton
            )}
            aria-label="Manage ignored commenters"
          >
            Manage
          </Button>
        </Localized>
      )}
      {showManage && (
        <HorizontalGutter
          spacing={1}
          className={cn(styles.list, CLASSES.ignoredCommenters.list)}
          role="log"
          aria-live="off"
          id="profile-account-ignoredCommenters-log"
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
              <div className={styles.empty} aria-live="polite">
                You are not currently ignoring anyone
              </div>
            </Localized>
          )}
        </HorizontalGutter>
      )}
    </section>
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
