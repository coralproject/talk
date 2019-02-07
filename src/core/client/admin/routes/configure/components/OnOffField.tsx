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

const OnOffField: StatelessComponent<Props> = ({
  name,
  disabled,
  invert = false,
}) => (
  <div>
    <Field name={name} type="radio" parse={parseStringBool} value={!invert}>
      {({ input }) => (
        <Localized id="configure-onOffField-on">
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
            On
          </RadioButton>
        </Localized>
      )}
    </Field>
    <Field name={name} type="radio" parse={parseStringBool} value={invert}>
      {({ input }) => (
        <Localized id="configure-onOffField-off">
          <RadioButton
            id={`${input.name}-fase`}
            name={input.name}
            onChange={input.onChange}
            onFocus={input.onFocus}
            onBlur={input.onBlur}
            checked={input.checked}
            disabled={disabled}
            value={input.value}
          >
            Off
          </RadioButton>
        </Localized>
      )}
    </Field>
  </div>
);

export default OnOffField;
