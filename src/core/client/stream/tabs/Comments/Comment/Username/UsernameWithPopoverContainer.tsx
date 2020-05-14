import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { BaseButton, ClickOutside, Popover } from "coral-ui/components/v2";

import { UsernameWithPopoverContainer_comment } from "coral-stream/__generated__/UsernameWithPopoverContainer_comment.graphql";
import { UsernameWithPopoverContainer_viewer } from "coral-stream/__generated__/UsernameWithPopoverContainer_viewer.graphql";

import UserPopoverContainer from "../UserPopover";
import Username from "./Username";

interface Props {
  comment: UsernameWithPopoverContainer_comment;
  viewer: UsernameWithPopoverContainer_viewer | null;
  className?: string;
  usernameClassName?: string;
}

const UsernameWithPopoverContainer: FunctionComponent<Props> = (props) => {
  const popoverID = `username-popover-${props.comment.id}`;
  if (!props.comment.author) {
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
              user={props.comment.author!}
              viewer={props.viewer}
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
            className={props.className}
          >
            <Username className={props.usernameClassName}>
              {props.comment.author!.username}
            </Username>
          </BaseButton>
        )}
      </Popover>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UsernameWithPopoverContainer_viewer on User {
      ...UserPopoverContainer_viewer
    }
  `,
  comment: graphql`
    fragment UsernameWithPopoverContainer_comment on Comment {
      id
      author {
        id
        username
        ...UserPopoverContainer_user
      }
    }
  `,
})(UsernameWithPopoverContainer);

export default enhanced;
