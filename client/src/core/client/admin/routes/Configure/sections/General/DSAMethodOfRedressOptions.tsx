import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useState,
} from "react";
import { Field } from "react-final-form";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { formatEmpty, parseEmptyAsNull } from "coral-framework/lib/form";
import { getMessage } from "coral-framework/lib/i18n";
import {
  validateEmail,
  validateURL,
  Validator,
} from "coral-framework/lib/validation";
import { GQLDSA_METHOD_OF_REDRESS } from "coral-framework/schema";
import { RadioButton } from "coral-ui/components/v2";

import { DSA_METHOD_OF_REDRESS } from "coral-admin/__generated__/DSAConfigContainer_formValues.graphql";

import TextFieldWithValidation from "../../TextFieldWithValidation";

import styles from "./DSAMethodOfRedressOptions.css";

interface Props {
  defaultMethod: DSA_METHOD_OF_REDRESS | null;
  validate?: Validator;
  disabled: boolean;
  format?: (value: any, name: string) => any;
  testIDs?: {
    on: string;
    off: string;
  };
  className?: string;
}

export const parseVal = (v: any, name: string) => {
  if (v === GQLDSA_METHOD_OF_REDRESS.NONE) {
    return GQLDSA_METHOD_OF_REDRESS.NONE;
  }
  if (v === GQLDSA_METHOD_OF_REDRESS.EMAIL) {
    return GQLDSA_METHOD_OF_REDRESS.EMAIL;
  }
  if (v === GQLDSA_METHOD_OF_REDRESS.URL) {
    return GQLDSA_METHOD_OF_REDRESS.URL;
  }

  return GQLDSA_METHOD_OF_REDRESS.NONE;
};

export const format = (v: string, name: string) => {
  return v;
};

const DSAMethodOfRedressOptions: FunctionComponent<Props> = ({
  defaultMethod,
  disabled,
  className,
}) => {
  const { localeBundles } = useCoralContext();

  const [mode, setMode] = useState<DSA_METHOD_OF_REDRESS | null>(defaultMethod);

  const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target?.value === GQLDSA_METHOD_OF_REDRESS.EMAIL) {
      setMode(GQLDSA_METHOD_OF_REDRESS.EMAIL);
    } else if (ev.target?.value === GQLDSA_METHOD_OF_REDRESS.URL) {
      setMode(GQLDSA_METHOD_OF_REDRESS.URL);
    } else {
      setMode(null);
    }
  }, []);

  const emailPlaceholder = getMessage(
    localeBundles,
    "configure-general-dsaConfig-methodOfRedress-email-placeholder",
    "moderation@example.com"
  );
  const urlPlaceholder = getMessage(
    localeBundles,
    "configure-general-dsaConfig-methodOfRedress-url-placeholder",
    "https://moderation.example.com"
  );

  return (
    <div className={className}>
      <Field
        name={"dsa.methodOfRedress.method"}
        type="radio"
        value={GQLDSA_METHOD_OF_REDRESS.NONE}
        parse={parseVal}
        format={format}
      >
        {({ input }) => (
          <RadioButton
            {...input}
            id={`${input.name}-none`}
            disabled={disabled}
            onChange={(ev) => {
              input.onChange(ev);
              onChange(ev);
            }}
          >
            <Localized id="configure-general-dsaConfig-methodOfRedress-none">
              <span>None</span>
            </Localized>
          </RadioButton>
        )}
      </Field>
      <Field
        name={"dsa.methodOfRedress.method"}
        type="radio"
        value={GQLDSA_METHOD_OF_REDRESS.EMAIL}
        parse={parseVal}
        format={format}
      >
        {({ input }) => (
          <RadioButton
            {...input}
            id={`${input.name}-email`}
            disabled={disabled}
            onChange={(ev) => {
              input.onChange(ev);
              onChange(ev);
            }}
          >
            <Localized id="configure-general-dsaConfig-methodOfRedress-email">
              <span>Email</span>
            </Localized>
          </RadioButton>
        )}
      </Field>
      {mode === GQLDSA_METHOD_OF_REDRESS.EMAIL && (
        <Field
          name="dsa.methodOfRedress.email"
          parse={parseEmptyAsNull}
          format={formatEmpty}
          validate={validateEmail}
        >
          {({ input, meta }) => (
            <div className={styles.textInput}>
              <TextFieldWithValidation
                {...input}
                id={`configure-advanced-${input.name}`}
                disabled={disabled}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                fullWidth
                meta={meta}
                placeholder={emailPlaceholder}
              />
            </div>
          )}
        </Field>
      )}
      <Field
        name={"dsa.methodOfRedress.method"}
        type="radio"
        parse={parseVal}
        value={GQLDSA_METHOD_OF_REDRESS.URL}
        format={format}
      >
        {({ input }) => {
          return (
            <RadioButton
              {...input}
              id={`${input.name}-url`}
              disabled={disabled}
              onChange={(ev) => {
                input.onChange(ev);
                onChange(ev);
              }}
            >
              <Localized id="configure-general-dsaConfig-methodOfRedress-url">
                <span>URL</span>
              </Localized>
            </RadioButton>
          );
        }}
      </Field>
      {mode === GQLDSA_METHOD_OF_REDRESS.URL && (
        <Field
          name="dsa.methodOfRedress.url"
          parse={parseEmptyAsNull}
          format={formatEmpty}
          validate={validateURL}
        >
          {({ input, meta }) => (
            <div className={styles.textInput}>
              <TextFieldWithValidation
                {...input}
                id={`configure-advanced-${input.name}`}
                disabled={disabled}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                fullWidth
                meta={meta}
                placeholder={urlPlaceholder}
              />
            </div>
          )}
        </Field>
      )}
    </div>
  );
};

export default DSAMethodOfRedressOptions;
