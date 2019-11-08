import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import {
  Button,
  ClickOutside,
  Icon,
  MatchMedia,
  Popover,
} from "coral-ui/components";

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
          <Button
            onClick={toggleVisibility}
            aria-controls={popoverID}
            ref={ref}
            variant="textUnderlined"
            active={visible}
            size="small"
            color="primary"
            className={className}
          >
            <MatchMedia gtWidth="xs">
              <Icon>share</Icon>
            </MatchMedia>
            <Localized id="comments-permalinkButton-share">
              <span>Share</span>
            </Localized>
          </Button>
        )}
      </Popover>
    </Localized>
  );
};

export default Permalink;
