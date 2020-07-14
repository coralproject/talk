import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  ClickOutside,
  Flex,
  Icon,
  MatchMedia,
  Popover,
} from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

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
        placement="bottom"
        description="A dialog showing a permalink to the comment"
        modifiers={{
          arrow: {
            enabled: false,
          },
        }}
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <PermalinkPopover
              permalinkURL={url}
              commentID={commentID}
              toggleVisibility={toggleVisibility}
            />
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
              active={visible}
              variant="flat"
              color="secondary"
              fontSize="small"
              fontWeight="semiBold"
              paddingSize="extraSmall"
            >
              <Flex alignItems="center" container="span">
                <Icon className={styles.icon}>share</Icon>
                <MatchMedia gtWidth="xs">
                  <Localized id="comments-permalinkButton-share">
                    <span>Share</span>
                  </Localized>
                </MatchMedia>
              </Flex>
            </Button>
          </Localized>
        )}
      </Popover>
    </Localized>
  );
};

export default Permalink;
