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
  onLabel?: React.ReactNode;
  offLabel?: React.ReactNode;
}

const OnOffField: FunctionComponent<Props> = ({
  name,
  disabled,
  onLabel,
  offLabel,
  invert = false,
}) => (
  <div>
    <Field name={name} type="radio" parse={parseStringBool} value={!invert}>
      {({ input }) => (
        <RadioButton
          id={`${input.name}-true`}
          name={input.name}
          onChange={input.onChange}
          onFocus={input.onFocus}
          onBlur={input.onBlur}
          checked={input.checked}
          disabled={disabled}
          value={input.value}
        >
          {onLabel || (
            <Localized id="configure-onOffField-on">
              <span>On</span>
            </Localized>
          )}
        </RadioButton>
      )}
    </Field>
    <Field name={name} type="radio" parse={parseStringBool} value={invert}>
      {({ input }) => (
        <RadioButton
          id={`${input.name}-false`}
          name={input.name}
          onChange={input.onChange}
          onFocus={input.onFocus}
          onBlur={input.onBlur}
          checked={input.checked}
          disabled={disabled}
          value={input.value}
        >
          {offLabel || (
            <Localized id="configure-onOffField-off">
              <span>Off</span>
            </Localized>
          )}
        </RadioButton>
      )}
    </Field>
  </div>
);

export default OnOffField;
