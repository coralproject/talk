import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { UsernameWithPopoverContainer_user as UserData } from "coral-stream/__generated__/UsernameWithPopoverContainer_user.graphql";
import { BaseButton, ClickOutside, Popover } from "coral-ui/components";

import UserPopover from "../UserPopover";
import Username from "./Username";

import styles from "./UsernameWithPopoverContainer.css";

interface Props {
  user: UserData;
}

const UsernameWithPopoverContainer: FunctionComponent<Props> = props => {
  const popoverID = `username-popover`;
  return (
    <Localized id="comments-userPopover" attrs={{ description: true }}>
      <Popover
        id={popoverID}
        placement="bottom-start"
        description="A popover with more user information"
        classes={{ popover: styles.popover }}
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <UserPopover user={props.user} />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref }) => (
          <BaseButton
            onClick={toggleVisibility}
            aria-controls={popoverID}
            ref={ref}
          >
            <Username>{props.user.username || <NotAvailable />}</Username>
          </BaseButton>
        )}
      </Popover>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UsernameWithPopoverContainer_user on User {
      username
      ...UserPopoverContainer_user
    }
  `,
})(UsernameWithPopoverContainer);

export default enhanced;
