import { Localized } from "fluent-react/compat";
import React from "react";
import { FunctionComponent } from "react";

import { BaseButton, ClickOutside, Popover } from "coral-ui/components";

import Username from "../Username";
import styles from "./UsernameWithPopover.css";

interface Props {
  popover: React.ReactNode;
  children: React.ReactNode;
}

const UsernameWithPopover: FunctionComponent<Props> = props => {
  const popoverID = `username-popover`;
  return (
    <Localized id="comments-authorPopover" attrs={{ description: true }}>
      <Popover
        id={popoverID}
        placement="bottom-start"
        description="A popover with more user information"
        classes={{ popover: styles.popover }}
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            {props.popover}
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref }) => (
          <BaseButton
            onClick={toggleVisibility}
            aria-controls={popoverID}
            ref={ref}
          >
            <Username>{props.children}</Username>
          </BaseButton>
        )}
      </Popover>
    </Localized>
  );
};

export default UsernameWithPopover;
