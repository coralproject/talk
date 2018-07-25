import { Localized } from "fluent-react/compat";
import React from "react";
import { Button, Popover } from "talk-ui/components";
import PermalinkPopover from "./PermalinkPopover";

interface InnerProps {
  commentID: string;
  origin: string | null;
}

class Permalink extends React.Component<InnerProps> {
  public render() {
    const { commentID, origin } = this.props;
    return (
      <Popover
        placement="top"
        body={({ toggleVisibility, forwardRef }) => (
          <PermalinkPopover
            permalinkUrl={`${origin}/?commentID=${commentID}`}
            forwardRef={forwardRef}
            toggleVisibility={toggleVisibility}
          />
        )}
      >
        {({ toggleVisibility, forwardRef }) => (
          <Button onClick={toggleVisibility} forwardRef={forwardRef}>
            <Localized id="comments-permalink-share">
              <span>Share</span>
            </Localized>
          </Button>
        )}
      </Popover>
    );
  }
}

export default Permalink;
