import React, { FunctionComponent } from "react";
import { Control, useController } from "react-hook-form";

import { CheckBox } from "coral-ui/components/v2";

export interface Props {
  name: string;
  control: Control;
  defaultValue: any;
  disabled?: boolean;
  children: React.ReactChildren | React.ReactChild;
}

const HookCheckBox: FunctionComponent<Props> = ({
  name,
  control,
  defaultValue,
  disabled = false,
  children,
}) => {
  const {
    field: { ref, ...fieldProps },
  } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <CheckBox {...fieldProps} disabled={disabled} ref={ref}>
      {children}
    </CheckBox>
  );
};

export default HookCheckBox;
