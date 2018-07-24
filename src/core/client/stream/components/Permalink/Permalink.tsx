import { Localized } from "fluent-react/compat";
import React from "react";
import { Button, Popover } from "talk-ui/components";
import PermalinkPopover from "./PermalinkPopover";

interface InnerProps {
  commentID: string;
}

class Permalink extends React.Component<InnerProps> {
  public render() {
    const { commentID } = this.props;
    return (
      <Popover
        placement="top"
        body={({ toggleVisibility, forwardRef }) => (
          <PermalinkPopover
            commentID={commentID}
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
