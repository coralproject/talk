import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { ShowIgnoreUserdDialogEvent } from "coral-stream/events";
import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

import { IgnoreUserSettingsContainer_viewer as ViewerData } from "coral-stream/__generated__/IgnoreUserSettingsContainer_viewer.graphql";

import Username from "../Settings/Username";
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
    setShowManage(!showManage);
  }, [showManage, setShowManage]);
  return (
    <div
      data-testid="profile-account-ignoredCommenters"
      className={CLASSES.ignoredCommenters.$root}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Localized id="profile-account-ignoredCommenters">
          <Typography color="textDark" variant="heading2">
            Ignored Commenters
          </Typography>
        </Localized>
        {showManage && (
          <Localized id="profile-account-ignoredCommenters-cancel">
            <Button
              variant="outlineFilled"
              size="small"
              color="primary"
              onClick={toggleManage}
              className={CLASSES.ignoredCommenters.manageButton}
            >
              Cancel
            </Button>
          </Localized>
        )}
        {!showManage && (
          <Localized id="profile-account-ignoredCommenters-manage">
            <Button
              variant="outlineFilled"
              size="small"
              color="primary"
              onClick={toggleManage}
              className={CLASSES.ignoredCommenters.manageButton}
            >
              Manage
            </Button>
          </Localized>
        )}
      </Flex>
      {showManage && (
        <div>
          <Localized id="profile-account-ignoredCommenters-description">
            <p className={styles.description}>
              Once you ignore someone, all of their comments are hidden from
              you. Commenters you ignore will still be able to see your
              comments.
            </p>
          </Localized>
          <HorizontalGutter spacing={1}>
            {viewer.ignoredUsers.map(user => (
              <Flex
                key={user.id}
                justifyContent="space-between"
                alignItems="center"
              >
                <Username className={CLASSES.ignoredCommenters.username}>
                  {user.username}
                </Username>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => removeUserIgnore({ userID: user.id })}
                  className={CLASSES.ignoredCommenters.stopIgnoreButton}
                >
                  <Icon>close</Icon>
                  <Localized id="profile-account-ignoredCommenters-stopIgnoring">
                    <span>Stop ignoring</span>
                  </Localized>
                </Button>
              </Flex>
            ))}
            {viewer.ignoredUsers.length === 0 && (
              <Localized id="profile-account-ignoredCommenters-empty">
                <div className={styles.empty}>
                  You are not currently ignoring anyone
                </div>
              </Localized>
            )}
          </HorizontalGutter>
        </div>
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
