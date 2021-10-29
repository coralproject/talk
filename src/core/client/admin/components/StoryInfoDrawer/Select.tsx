import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useState } from "react";
import { Control, useController } from "react-hook-form";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "coral-ui/components/v2";

import { Placement } from "coral-ui/components/v2/Popover/Popover";

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
  placement?: Placement;
}

const Select: FunctionComponent<Props> = ({
  id,
  label,
  placement,
  options,
  selected,
  description,
  onSelect,
}) => {
  const [current, setCurrent] = useState(selected || options?.[0]);
  return (
    <>
      {label && <span className={styles.label}>{label}:</span>}
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

type HookSelectProps = Omit<Props, "onSelect"> & {
  control: Control;
};

export const HookSelect: FunctionComponent<HookSelectProps> = ({
  name,
  control,
  ...rest
}) => {
  const {
    field: { ref, ...fieldProps },
  } = useController({
    name,
    control,
  });

  return <Select {...rest} name={name} onSelect={fieldProps.onChange} />;
};

export default Select;
