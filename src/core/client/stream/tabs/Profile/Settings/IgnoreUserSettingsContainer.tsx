import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { IgnoreUserSettingsContainer_viewer as ViewerData } from "coral-stream/__generated__/IgnoreUserSettingsContainer_viewer.graphql";
import CLASSES from "coral-stream/classes";
import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

import styles from "./IgnoreUserSettingsContainer.css";
import RemoveUserIgnoreMutation from "./RemoveUserIgnoreMutation";
import Username from "./Username";

interface Props {
  viewer: ViewerData;
}

const IgnoreUserSettingsContainer: FunctionComponent<Props> = ({ viewer }) => {
  const removeUserIgnore = useMutation(RemoveUserIgnoreMutation);
  const [showManage, setShowManage] = useState(false);
  const toggleManage = useCallback(() => setShowManage(!showManage), [
    showManage,
    setShowManage,
  ]);
  return (
    <div
      className={CLASSES.ignoredCommenters.$root}
      data-testid="profile-settings-ignoredCommenters"
    >
      <Flex justifyContent="space-between">
        <Localized id="profile-settings-ignoredCommenters">
          <Typography variant="heading3">Ignored Commenters</Typography>
        </Localized>
        <Button onClick={toggleManage}>Manage</Button>
      </Flex>
      {showManage && (
        <div>
          <Localized id="profile-settings-description">
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
                  <Localized id="profile-settings-stopIgnoring">
                    <span>Stop ignoring</span>
                  </Localized>
                </Button>
              </Flex>
            ))}
            {viewer.ignoredUsers.length === 0 && (
              <Localized id="profile-settings-empty">
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
