import { Localized } from "fluent-react/compat";
import React from "react";
import { Button, ButtonIcon, Popover } from "talk-ui/components";
import PermalinkPopover from "./PermalinkPopover";

interface InnerProps {
  commentID: string;
  origin: string | null;
  assetID: string | null;
}

class Permalink extends React.Component<InnerProps> {
  public render() {
    const { commentID, origin, assetID } = this.props;
    return (
      <Popover
        placement="top"
        body={({ toggleVisibility, forwardRef }) => (
          <PermalinkPopover
            // TODO (bc) temporary needed to pass the assetID to go back to the correct asset until the backend
            // returns the correct asset url
            permalinkUrl={`${origin}/?commentID=${commentID}&assetID=${assetID}`}
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
