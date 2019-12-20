import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import {
  Button,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import { UserPopoverOverviewContainer_user as UserData } from "coral-stream/__generated__/UserPopoverOverviewContainer_user.graphql";
import { UserPopoverOverviewContainer_viewer as ViewerData } from "coral-stream/__generated__/UserPopoverOverviewContainer_viewer.graphql";

import Username from "../Username";

import styles from "./UserPopoverOverviewContainer.css";

interface Props {
  user: UserData;
  viewer: ViewerData | null;
  onIgnore: React.EventHandler<React.MouseEvent>;
}

export const UserPopoverOverviewContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  onIgnore,
}) => {
  const canIgnore =
    viewer &&
    viewer.id !== user.id &&
    viewer.ignoredUsers.every(u => u.id !== user.id) &&
    user.ignoreable;
  return (
    <HorizontalGutter
      spacing={3}
      className={cn(styles.root, CLASSES.userPopover.$root)}
    >
      <HorizontalGutter spacing={2}>
        <div>
          <Username className={CLASSES.userPopover.username}>
            {user.username}
          </Username>
        </div>
        <Localized
          id="comments-userPopover-memberSince"
          $timestamp={new Date(user.createdAt)}
        >
          <Typography variant="detail" container="div">
            Member since: {user.createdAt}
          </Typography>
        </Localized>
      </HorizontalGutter>
      {canIgnore && (
        <Flex justifyContent="flex-end">
          <Localized id="comments-userPopover-ignore">
            <Button
              variant="outlined"
              size="small"
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
    }
  `,
})(UserPopoverOverviewContainer);

export default enhanced;
