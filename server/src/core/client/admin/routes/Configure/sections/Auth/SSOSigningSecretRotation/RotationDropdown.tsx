import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  Button,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Icon,
  Popover,
} from "coral-ui/components/v2";

import RotateOption, { RotateOptions } from "./RotationOption";

import styles from "./RotationDropdown.css";

interface Props {
  onRotateKey: (rotation: string) => void;
  disabled?: boolean;
}

const RotationDropDown: FunctionComponent<Props> = ({
  onRotateKey,
  disabled,
}) => {
  return (
    <Localized
      id="configure-auth-sso-rotate-dropdown-description"
      attrs={{ description: true }}
    >
      <Popover
        id="sso-key-rotate"
        placement="bottom-start"
        description="A dropdown to rotate the SSO key"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <Dropdown>
              {Object.keys(RotateOptions).map((opt: string) => (
                <DropdownButton
                  key={opt}
                  onClick={() => {
                    onRotateKey(opt);
                    toggleVisibility();
                  }}
                  disabled={disabled}
                >
                  <RotateOption value={opt}></RotateOption>
                </DropdownButton>
              ))}
            </Dropdown>
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref, visible }) => (
          <Button
            onClick={toggleVisibility}
            ref={ref}
            color="regular"
            disabled={disabled}
          >
            <Localized id="configure-auth-sso-rotate-rotate">
              <span className={styles.rotate}>Rotate</span>
            </Localized>
            <Icon>arrow_drop_down</Icon>
          </Button>
        )}
      </Popover>
    </Localized>
  );
};

export default RotationDropDown;
