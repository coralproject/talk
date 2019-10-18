import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { BaseButton, ClickOutside, Popover } from "coral-ui/components";

import { UsernameWithPopoverContainer_user as UserData } from "coral-stream/__generated__/UsernameWithPopoverContainer_user.graphql";
import { UsernameWithPopoverContainer_viewer as ViewerData } from "coral-stream/__generated__/UsernameWithPopoverContainer_viewer.graphql";

import UserPopoverContainer from "../UserPopover";
import Username from "./Username";

interface Props {
  user: UserData;
  viewer: ViewerData | null;
  className?: string;
}

const UsernameWithPopoverContainer: FunctionComponent<Props> = props => {
  const popoverID = `username-popover`;
  return (
    <Localized id="comments-userPopover" attrs={{ description: true }}>
      <Popover
        id={popoverID}
        placement="bottom-start"
        description="A popover with more user information"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <UserPopoverContainer
              user={props.user}
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
            <Username>{props.user.username}</Username>
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
  user: graphql`
    fragment UsernameWithPopoverContainer_user on User {
      username
      ...UserPopoverContainer_user
    }
  `,
})(UsernameWithPopoverContainer);

export default enhanced;
