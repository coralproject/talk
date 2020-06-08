import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "coral-ui/components/v2";

interface Props {
  onRescrape: () => void;
  onOpen: () => void;
  onClose: () => void;
  canOpen: boolean;
  canClose: boolean;
}

const StoryActions: FunctionComponent<Props> = ({
  onRescrape,
  onOpen,
  onClose,
  canOpen,
  canClose,
}) => {
  return (
    <Localized id="stories-actions-popover" attrs={{ description: true }}>
      <Popover
        id="stories-Actions"
        placement="bottom-start"
        description="A dropdown to select story actions"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <Dropdown>
              <Localized id="stories-actions-rescrape">
                <DropdownButton
                  onClick={() => {
                    onRescrape();
                    toggleVisibility();
                  }}
                >
                  Re-scrape
                </DropdownButton>
              </Localized>
              {canOpen && (
                <Localized id="stories-actions-open">
                  <DropdownButton
                    onClick={() => {
                      onOpen();
                      toggleVisibility();
                    }}
                  >
                    Open story
                  </DropdownButton>
                </Localized>
              )}
              {canClose && (
                <Localized id="stories-actions-close">
                  <DropdownButton
                    onClick={() => {
                      onClose();
                      toggleVisibility();
                    }}
                  >
                    Close story
                  </DropdownButton>
                </Localized>
              )}
            </Dropdown>
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref, visible }) => (
          <Localized id="stories-actionsButton" attrs={{ "aria-label": true }}>
            <Button
              aria-label="Select action"
              onClick={toggleVisibility}
              ref={ref}
              color="mono"
              variant="text"
              uppercase={false}
            >
              {<ButtonIcon size="lg">more_horiz</ButtonIcon>}
            </Button>
          </Localized>
        )}
      </Popover>
    </Localized>
  );
};

export default StoryActions;
