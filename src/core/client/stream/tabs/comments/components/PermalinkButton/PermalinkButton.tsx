import { Localized } from "fluent-react/compat";
import React from "react";

import { oncePerFrame } from "talk-common/utils";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  MatchMedia,
  Popover,
} from "talk-ui/components";

import * as styles from "./PermalinkButton.css";
import PermalinkPopover from "./PermalinkPopover";

interface PermalinkProps {
  commentID: string;
  url: string;
}

class Permalink extends React.Component<PermalinkProps> {
  // Helper that prevents calling toggleVisibility more then once per frame.
  // In essence this means we'll process an event only once.
  // This might happen, when clicking on the button which will
  // cause its onClick to happen as well as onClickOutside.
  private toggleVisibilityOncePerFrame = oncePerFrame(
    (toggleVisibility: () => void) => toggleVisibility()
  );

  public render() {
    const { commentID, url } = this.props;
    const popoverID = `permalink-popover-${commentID}`;
    return (
      <Popover
        id={popoverID}
        placement="top-start"
        description="A dialog showing a permalink to the comment"
        classes={{ popover: styles.popover }}
        body={({ toggleVisibility }) => (
          <ClickOutside
            onClickOutside={() =>
              this.toggleVisibilityOncePerFrame(toggleVisibility)
            }
          >
            <PermalinkPopover
              permalinkURL={url}
              toggleVisibility={toggleVisibility}
            />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, forwardRef, visible }) => (
          <Button
            onClick={() => this.toggleVisibilityOncePerFrame(toggleVisibility)}
            aria-controls={popoverID}
            forwardRef={forwardRef}
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
  }
}

export default Permalink;
