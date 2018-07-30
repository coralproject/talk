import { Localized } from "fluent-react/compat";
import React from "react";
import { Button, ButtonIcon, Popover } from "talk-ui/components";
import PermalinkPopover from "./PermalinkPopover";

interface PermalinkProps {
  commentID: string;
  assetURL: string | null;
}

class Permalink extends React.Component<PermalinkProps> {
  public render() {
    const { commentID, assetURL } = this.props;
    return (
      <Popover
        id="permalink-popover"
        placement="top"
        body={({ toggleVisibility }) => (
          <PermalinkPopover
            permalinkUrl={`${assetURL}&commentID=${commentID}`}
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
