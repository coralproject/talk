import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  Button,
  ClickOutside,
  Icon,
  MatchMedia,
  Popover,
} from "coral-ui/components/v2";

import PermalinkPopover from "./PermalinkPopover";

import styles from "./PermalinkButton.css";

interface PermalinkProps {
  commentID: string;
  url: string;
  className?: string;
}

const Permalink: FunctionComponent<PermalinkProps> = ({
  commentID,
  url,
  className,
}) => {
  const popoverID = `permalink-popover-${commentID}`;
  return (
    <Localized id="comments-permalinkPopover" attrs={{ description: true }}>
      <Popover
        id={popoverID}
        placement="top"
        description="A dialog showing a permalink to the comment"
        classes={{ popover: styles.popover }}
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <PermalinkPopover permalinkURL={url} commentID={commentID} />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref, visible }) => (
          <Localized
            id="comments-permalinkButton"
            attrs={{ "aria-label": true }}
          >
            <Button
              onClick={toggleVisibility}
              aria-controls={popoverID}
              ref={ref}
              variant="text"
              active={visible}
              size="regular"
              color="mono"
              className={className}
            >
              <Icon>share</Icon>
              <MatchMedia gtWidth="xs">
                <Localized id="comments-permalinkButton-share">
                  <span>Share</span>
                </Localized>
              </MatchMedia>
            </Button>
          </Localized>
        )}
      </Popover>
    </Localized>
  );
};

export default Permalink;
