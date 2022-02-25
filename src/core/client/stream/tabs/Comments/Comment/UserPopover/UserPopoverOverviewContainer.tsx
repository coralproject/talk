import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import CLASSES from "coral-stream/classes";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { UserPopoverOverviewContainer_settings$key } from "coral-stream/__generated__/UserPopoverOverviewContainer_settings.graphql";
import { UserPopoverOverviewContainer_user$key } from "coral-stream/__generated__/UserPopoverOverviewContainer_user.graphql";
import { UserPopoverOverviewContainer_viewer$key } from "coral-stream/__generated__/UserPopoverOverviewContainer_viewer.graphql";

import Username from "../Username";

import styles from "./UserPopoverOverviewContainer.css";

interface Props {
  user: UserPopoverOverviewContainer_user$key;
  viewer: UserPopoverOverviewContainer_viewer$key | null;
  onIgnore: React.EventHandler<React.MouseEvent>;
  settings: UserPopoverOverviewContainer_settings$key;
}

export const UserPopoverOverviewContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  onIgnore,
  settings,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment UserPopoverOverviewContainer_viewer on User {
        id
        ignoredUsers {
          id
        }
      }
    `,
    viewer
  );
  const userData = useFragment(
    graphql`
      fragment UserPopoverOverviewContainer_user on User {
        id
        username
        createdAt
        ignoreable
        bio
      }
    `,
    user
  );
  const settingsData = useFragment(
    graphql`
      fragment UserPopoverOverviewContainer_settings on Settings {
        memberBios
      }
    `,
    settings
  );

  const canIgnore =
    viewerData &&
    viewerData.id !== userData.id &&
    viewerData.ignoredUsers.every((u) => u.id !== userData.id) &&
    userData.ignoreable;
  return (
    <HorizontalGutter
      spacing={3}
      className={cn(styles.root, CLASSES.userPopover.$root)}
    >
      <HorizontalGutter spacing={2}>
        <div>
          <Username
            className={cn(styles.username, CLASSES.userPopover.username)}
          >
            {userData.username}
          </Username>
        </div>
        <Localized
          id="comments-userPopover-memberSince"
          $timestamp={new Date(userData.createdAt)}
        >
          <div className={styles.memberSince}>
            Member since: {userData.createdAt}
          </div>
        </Localized>
        {settingsData.memberBios && userData.bio && <div>{userData.bio}</div>}
      </HorizontalGutter>
      {canIgnore && (
        <Flex justifyContent="flex-end">
          <Localized id="comments-userPopover-ignore">
            <Button
              variant="outlined"
              fontSize="extraSmall"
              paddingSize="extraSmall"
              color="secondary"
              upperCase
              onClick={onIgnore}
              className={CLASSES.userPopover.ignoreButton}
            >
              Ignore
            </Button>
          </Localized>
        </Flex>
      )}
    </HorizontalGutter>
  );
};

export default UserPopoverOverviewContainer;
