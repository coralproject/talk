/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useState } from "react";

import {
  Button,
  ButtonIcon,
  Dropdown,
  DropdownButton,
  ClickOutside,
  Popover,
} from "coral-ui/components/v2";

import { Placement } from "coral-ui/components/v2/Popover/Popover"

import styles from "./Select.css";

export interface Props {
  id: string;
  selected?: any;
  options: any[];
  onSelect: (option: any) => void;
  description: string;
  placement?: Placement; // TODO (marcushaddon): import Placement type
}

const StoryActions: FunctionComponent<Props> = ({
  id,
  placement,
  options,
  selected,
  description,
  onSelect
}) => {
  const [current, setCurrent] = useState(selected || options?.[0]);
  return (
    <Popover
      id={id}
      placement={placement || "bottom-start"}
      description={description}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown>
            {options.map((option, i) => (
              <DropdownButton
                key={i}
                onClick={() => {
                  onSelect(option);
                  setCurrent(option);
                  toggleVisibility();
                }}
              >
                {option}
              </DropdownButton>
            ))}
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
            {current}
            {
              <ButtonIcon size="lg">
                {visible ? "expand_less" : "expand_more"}
              </ButtonIcon>
            }
          </Button>
        </Localized>
      )}
    </Popover>
  );
};

export default StoryActions;
