import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { validateStrictURLList } from "coral-framework/lib/validation";
import { Textarea } from "coral-ui/components/v2";

import ValidationMessage from "../../ValidationMessage";

import styles from "./AllowedOriginsTextarea.css";

interface Props {
  defaultValue?: ReadonlyArray<string>;
}

const AllowedOriginsTextarea: FunctionComponent<Props> = ({ defaultValue }) => (
  <Field
    name="allowedOrigins"
    parse={parseStringList}
    format={formatStringList}
    validate={validateStrictURLList}
    defaultValue={defaultValue}
  >
    {({ input, meta }) => (
      <>
        <Textarea
          {...input}
          className={styles.textArea}
          id={`configure-advanced-${input.name}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          fullwidth
        />
        <ValidationMessage meta={meta} />
      </>
    )}
  </Field>
);

export default AllowedOriginsTextarea;
