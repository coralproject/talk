import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { BaseButton, ClickOutside, Popover } from "coral-ui/components/v2";

import { UsernameWithPopoverContainer_comment$key as UsernameWithPopoverContainer_comment } from "coral-stream/__generated__/UsernameWithPopoverContainer_comment.graphql";
import { UsernameWithPopoverContainer_settings$key as UsernameWithPopoverContainer_settings } from "coral-stream/__generated__/UsernameWithPopoverContainer_settings.graphql";
import { UsernameWithPopoverContainer_viewer$key as UsernameWithPopoverContainer_viewer } from "coral-stream/__generated__/UsernameWithPopoverContainer_viewer.graphql";

import UserPopoverContainer from "../UserPopover";
import Username from "./Username";

interface Props {
  comment: UsernameWithPopoverContainer_comment;
  settings: UsernameWithPopoverContainer_settings;
  viewer: UsernameWithPopoverContainer_viewer | null;
  className?: string;
  usernameClassName?: string;
}

const UsernameWithPopoverContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  viewer,
  className,
  usernameClassName,
}) => {
  const commentData = useFragment(
    graphql`
      fragment UsernameWithPopoverContainer_comment on Comment {
        id
        author {
          id
          username
          ...UserPopoverContainer_user
        }
      }
    `,
    comment
  );
  const settingsData = useFragment(
    graphql`
      fragment UsernameWithPopoverContainer_settings on Settings {
        ...UserPopoverContainer_settings
      }
    `,
    settings
  );
  const viewerData = useFragment(
    graphql`
      fragment UsernameWithPopoverContainer_viewer on User {
        ...UserPopoverContainer_viewer
      }
    `,
    viewer
  );

  const popoverID = `username-popover-${commentData.id}`;
  if (!commentData.author) {
    return null;
  }
  return (
    <Localized id="comments-userPopover" attrs={{ description: true }}>
      <Popover
        id={popoverID}
        placement="bottom-start"
        description="A popover with more user information"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <UserPopoverContainer
              user={commentData.author!}
              viewer={viewerData}
              settings={settingsData}
              onDismiss={toggleVisibility}
            />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref }) => (
          <BaseButton
            onClick={toggleVisibility}
            aria-controls={popoverID}
            ref={ref}
            className={className}
          >
            <Username className={usernameClassName}>
              {commentData.author!.username}
            </Username>
          </BaseButton>
        )}
      </Popover>
    </Localized>
  );
};

export default UsernameWithPopoverContainer;
