import { Localized } from "fluent-react/compat";
import React from "react";
import { Button, ButtonIcon, Popover } from "talk-ui/components";
import PermalinkPopover from "./PermalinkPopover";

interface InnerProps {
  commentID: string;
  assetURL: string | null;
}

class Permalink extends React.Component<InnerProps> {
  public render() {
    const { commentID, assetURL } = this.props;
    return (
      <Popover
        placement="top"
        body={({ toggleVisibility, forwardRef }) => (
          <PermalinkPopover
            permalinkUrl={`${assetURL}&commentID=${commentID}`}
            forwardRef={forwardRef}
            toggleVisibility={toggleVisibility}
          />
        )}
      >
        {({ toggleVisibility, forwardRef }) => (
          <Button onClick={toggleVisibility} forwardRef={forwardRef}>
            <ButtonIcon>share</ButtonIcon>
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
