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
}

const StoryActions: FunctionComponent<Props> = ({ onRescrape }) => {
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
                <DropdownButton onClick={onRescrape}>Re-scrape</DropdownButton>
              </Localized>
            </Dropdown>
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref, visible }) => (
          <Localized id="stories-actionsButton" attrs={{ "aria-label": true }}>
            <Button
              aria-label="select action"
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
