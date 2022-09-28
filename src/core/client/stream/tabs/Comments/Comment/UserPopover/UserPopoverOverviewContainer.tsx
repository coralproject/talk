import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { UserPopoverOverviewContainer_settings } from "coral-stream/__generated__/UserPopoverOverviewContainer_settings.graphql";
import { UserPopoverOverviewContainer_user as UserData } from "coral-stream/__generated__/UserPopoverOverviewContainer_user.graphql";
import { UserPopoverOverviewContainer_viewer as ViewerData } from "coral-stream/__generated__/UserPopoverOverviewContainer_viewer.graphql";

import Username from "../Username";

import styles from "./UserPopoverOverviewContainer.css";

interface Props {
  user: UserData;
  viewer: ViewerData | null;
  onIgnore: React.EventHandler<React.MouseEvent>;
  settings: UserPopoverOverviewContainer_settings;
}

export const UserPopoverOverviewContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  onIgnore,
  settings,
}) => {
  const canIgnore =
    viewer &&
    viewer.id !== user.id &&
    viewer.ignoredUsers.every((u) => u.id !== user.id) &&
    user.ignoreable;
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
            {user.username}
          </Username>
        </div>
        <Localized
          id="comments-userPopover-memberSince"
          vars={{ timestamp: new Date(user.createdAt) }}
        >
          <div className={styles.memberSince}>
            Member since: {user.createdAt}
          </div>
        </Localized>
        {settings.memberBios && user.bio && <div>{user.bio}</div>}
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

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserPopoverOverviewContainer_viewer on User {
      id
      ignoredUsers {
        id
      }
    }
  `,
  user: graphql`
    fragment UserPopoverOverviewContainer_user on User {
      id
      username
      createdAt
      ignoreable
      bio
    }
  `,
  settings: graphql`
    fragment UserPopoverOverviewContainer_settings on Settings {
      memberBios
    }
  `,
})(UserPopoverOverviewContainer);

export default enhanced;
