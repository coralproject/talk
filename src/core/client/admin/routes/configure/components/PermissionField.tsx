import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { parseStringBool } from "talk-framework/lib/form";
import { Validator } from "talk-framework/lib/validation";
import { RadioButton } from "talk-ui/components";

interface Props {
  validate?: Validator;
  name: string;
  disabled: boolean;
  invert?: boolean;
}

const PermissionField: StatelessComponent<Props> = ({
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
            name={input.name}
            onChange={input.onChange}
            onFocus={input.onFocus}
            onBlur={input.onBlur}
            checked={input.checked}
            disabled={disabled}
            value={input.value}
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
            name={input.name}
            onChange={input.onChange}
            onFocus={input.onFocus}
            onBlur={input.onBlur}
            checked={input.checked}
            disabled={disabled}
            value={input.value}
          >
            Don't allow
          </RadioButton>
        </Localized>
      )}
    </Field>
  </div>
);

export default PermissionField;
