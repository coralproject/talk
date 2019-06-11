import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { UserPopoverOverviewContainer_user as UserData } from "coral-stream/__generated__/UserPopoverOverviewContainer_user.graphql";
import { UserPopoverOverviewContainer_viewer as ViewerData } from "coral-stream/__generated__/UserPopoverOverviewContainer_viewer.graphql";
import {
  Button,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

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
    <HorizontalGutter spacing={3} className={styles.root}>
      <HorizontalGutter spacing={2}>
        <div>
          <Username>{user.username!}</Username>
        </div>
        <Localized
          id="comments-userPopover-memberSince"
          $timestamp={user.createdAt}
        >
          <Typography variant="detail" container="div">
            Member since: {user.createdAt}
          </Typography>
        </Localized>
      </HorizontalGutter>
      {canIgnore && (
        <Flex justifyContent="flex-end">
          <Localized id="comments-userPopover-ignore">
            <Button variant="outlined" size="small" onClick={onIgnore}>
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
