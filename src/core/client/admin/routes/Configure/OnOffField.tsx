import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { formatBool, parseStringBool } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";
import { RadioButton } from "coral-ui/components/v2";

interface Props {
  validate?: Validator;
  name: string;
  disabled: boolean;
  invert?: boolean;
  onLabel?: React.ReactNode;
  offLabel?: React.ReactNode;
  format?: (value: any, name: string) => any;
  parse?: (value: any, name: string) => any;
  className?: string;
}

const OnOffField: FunctionComponent<Props> = ({
  name,
  disabled,
  onLabel,
  offLabel,
  invert = false,
  parse = parseStringBool,
  format = formatBool,
  className,
}) => (
  <div className={className}>
    <Field
      name={name}
      type="radio"
      value={JSON.stringify(!invert)}
      parse={parse}
      format={format}
    >
      {({ input }) => (
        <RadioButton {...input} id={`${input.name}-true`} disabled={disabled}>
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
      value={JSON.stringify(invert)}
    >
      {({ input }) => (
        <RadioButton {...input} id={`${input.name}-false`} disabled={disabled}>
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
