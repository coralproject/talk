import cn from "classnames";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import {
  formatNewLineDelimitedString,
  parseNewLineDelimitedString,
} from "talk-framework/lib/form";
import { Validator } from "talk-framework/lib/validation";

import ValidationMessage from "../../../components/ValidationMessage";

import styles from "./WordListTextArea.css";

interface Props {
  className?: string;
  validate?: Validator;
  id?: string;
  name: string;
  disabled: boolean;
}

const WordListTextArea: StatelessComponent<Props> = ({
  id,
  name,
  disabled,
  validate,
  className,
}) => (
  <Field
    name={name}
    parse={parseNewLineDelimitedString}
    format={formatNewLineDelimitedString}
    validate={validate}
  >
    {({ input, meta }) => (
      <>
        <textarea
          id={id}
          className={cn(className, styles.textArea)}
          name={input.name}
          onChange={input.onChange}
          value={input.value}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {meta.touched && (meta.error || meta.submitError) && (
          <ValidationMessage>
            {meta.error || meta.submitError}
          </ValidationMessage>
        )}
      </>
    )}
  </Field>
);

export default WordListTextArea;
