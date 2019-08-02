import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseStringBool } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";
import { RadioButton } from "coral-ui/components";

interface Props {
  validate?: Validator;
  name: string;
  disabled: boolean;
  invert?: boolean;
}

const PermissionField: FunctionComponent<Props> = ({
  name,
  disabled,
  invert = false,
}) => (
  <div>
    <Field name={name} type="radio" parse={parseStringBool} value={!invert}>
      {({ input }) => (
        <Localized id="configure-permissionField-allow">
          <RadioButton
            id={`${input.name}-allow`}
            disabled={disabled}
            {...input}
          >
            Allow
          </RadioButton>
        </Localized>
      )}
    </Field>
    <Field name={name} type="radio" parse={parseStringBool} value={invert}>
      {({ input }) => (
        <Localized id="configure-permissionField-dontAllow">
          <RadioButton
            id={`${input.name}-dontAllow`}
            disabled={disabled}
            {...input}
          >
            Don't allow
          </RadioButton>
        </Localized>
      )}
    </Field>
  </div>
);

export default PermissionField;
