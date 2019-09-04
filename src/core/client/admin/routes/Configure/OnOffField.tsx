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
  format?: ((value: any, name: string) => any) | null;
  parse?: ((value: any, name: string) => any) | null;
  className?: string;
}

const OnOffField: FunctionComponent<Props> = ({
  name,
  disabled,
  onLabel,
  offLabel,
  invert = false,
  parse = parseStringBool,
  format,
  className,
}) => (
  <div className={className}>
    <Field
      name={name}
      type="radio"
      value={!invert}
      parse={parse}
      format={format}
    >
      {({ input }) => (
        <RadioButton id={`${input.name}-true`} disabled={disabled} {...input}>
          {onLabel || (
            <Localized id="configure-onOffField-on">
              <span>On</span>
            </Localized>
          )}
        </RadioButton>
      )}
    </Field>
    <Field
      name={name}
      type="radio"
      parse={parse}
      format={format}
      value={invert}
    >
      {({ input }) => (
        <RadioButton id={`${input.name}-false`} disabled={disabled} {...input}>
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
