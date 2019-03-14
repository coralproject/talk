import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  MatchMedia,
  Popover,
} from "talk-ui/components";

import PermalinkPopover from "./PermalinkPopover";

import styles from "./PermalinkButton.css";

interface PermalinkProps {
  commentID: string;
  url: string;
}

const Permalink: StatelessComponent<PermalinkProps> = ({ commentID, url }) => {
  const popoverID = `permalink-popover-${commentID}`;
  return (
    <Popover
      id={popoverID}
      placement="top-start"
      description="A dialog showing a permalink to the comment"
      classes={{ popover: styles.popover }}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <PermalinkPopover permalinkURL={url} />
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, forwardRef, visible }) => (
        <Button
          onClick={toggleVisibility}
          aria-controls={popoverID}
          ref={forwardRef}
          variant="ghost"
          active={visible}
          size="small"
        >
          <MatchMedia gtWidth="xs">
            <ButtonIcon>share</ButtonIcon>
          </MatchMedia>
          <Localized id="comments-permalinkButton-share">
            <span>Share</span>
          </Localized>
        </Button>
      )}
    </Popover>
  );
};

export default Permalink;
