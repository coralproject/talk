import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { Validator } from "coral-framework/lib/validation";
import { RadioButton } from "coral-ui/components/v2";

interface Props {
  validate?: Validator;
  name: string;
  disabled: boolean;
  format?: (value: any, name: string) => any;
  testIDs?: {
    on: string;
    off: string;
  };
  className?: string;
}

export enum DSAMethodOfRedress {
  None = "NONE",
  Email = "EMAIL",
  URL = "URL",
}

export const parseVal = (v: any, name: string) => {
  if (v === DSAMethodOfRedress.None) {
    return DSAMethodOfRedress.None;
  }
  if (v === DSAMethodOfRedress.Email) {
    return DSAMethodOfRedress.Email;
  }
  if (v === DSAMethodOfRedress.URL) {
    return DSAMethodOfRedress.URL;
  }

  return DSAMethodOfRedress.None;
};

export const format = (v: string, name: string) => {
  return v;
};

const DSAMethodOfRedressOptions: FunctionComponent<Props> = ({
  name,
  disabled,
  className,
}) => (
  <div className={className}>
    <Field
      name={name}
      type="radio"
      value={DSAMethodOfRedress.None}
      parse={parseVal}
      format={format}
    >
      {({ input }) => (
        <RadioButton {...input} id={`${input.name}-none`} disabled={disabled}>
          <Localized id="configure-general-dsaConfig-methodOfRedress-none">
            <span>None</span>
          </Localized>
        </RadioButton>
      )}
    </Field>
    <Field
      name={name}
      type="radio"
      value={DSAMethodOfRedress.Email}
      parse={parseVal}
      format={format}
    >
      {({ input }) => (
        <RadioButton {...input} id={`${input.name}-email`} disabled={disabled}>
          <Localized id="configure-general-dsaConfig-methodOfRedress-email">
            <span>Email</span>
          </Localized>
        </RadioButton>
      )}
    </Field>
    <Field
      name={name}
      type="radio"
      parse={parseVal}
      value={DSAMethodOfRedress.URL}
      format={format}
    >
      {({ input }) => {
        return (
          <RadioButton {...input} id={`${input.name}-url`} disabled={disabled}>
            <Localized id="configure-general-dsaConfig-methodOfRedress-url">
              <span>URL</span>
            </Localized>
          </RadioButton>
        );
      }}
    </Field>
  </div>
);

export default DSAMethodOfRedressOptions;
