/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import { useField } from "formik";
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
  name: string;
  label?: string;
  className?: string;
  selected?: any;
  options: any[];
  onSelect: (option: any) => void;
  description: string;
  placement?: Placement; // TODO (marcushaddon): import Placement type
}

const Select: FunctionComponent<Props> = ({
  id,
  label,
  placement,
  options,
  selected,
  description,
  onSelect
}) => {
  const [current, setCurrent] = useState(selected || options?.[0]);
  return (
    <>
      {label && (
        <span className={styles.label}>{label}:</span>
      )}
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
              className={styles.toggleButton}
              onClick={toggleVisibility}
              ref={ref}
              color="mono"
              variant="text"
              uppercase={false}
            >
              {current}
              {
                <ButtonIcon size="lg">
                  {visible ? "arrow_drop_up" : "arrow_drop_down"}
                </ButtonIcon>
              }
            </Button>
          </Localized>
        )}
      </Popover>
    </>
  );
};

export const FormikSelect: FunctionComponent<Props> = (props) => {
  const [field, meta, helpers] = useField(props.name);
  return (
    <Select
      {...props}
      onSelect={(selected) => helpers.setValue(selected)}
    />
  )
};

export default Select;
