import React from "react";
import ToggleShow from "./ToggleShow";

const PermalinkShareButton = () => (
  <ToggleShow>
    {({ toggleShow, show }) => (
      <Manager>
        <Reference>
          {({ ref }) => (
            <Button ref={ref} onClick={toggleShow} aria-controls="popover-id">
              Share
            </Button>
          )}
        </Reference>
        <Popper placement="right">
          {({ ref, style, placement, arrowProps }) => (
            <PermalinkPopover
              visible={show}
              style={style}
              ref={ref}
              id="popover-id"
            />
          )}
        </Popper>
      </Manager>
    )}
  </ToggleShow>
);

export default PermalinkShareButton;
