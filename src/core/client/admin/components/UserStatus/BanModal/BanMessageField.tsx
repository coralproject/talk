import { Field, FieldProps, useFormikContext } from "formik";
import React, { FunctionComponent } from "react";

import { Textarea } from "coral-ui/components/v2";

import styles from "./BanMessageField.css";

const BanMessageField: FunctionComponent<{}> = () => {
  const {
    values: { showMessage },
  } = useFormikContext();
  if (!showMessage) {
    return null;
  }
  return (
    <div>
      <Field name="emailMessage">
        {({ field }: FieldProps) => (
          <Textarea
            id="banModal-message"
            className={styles.textArea}
            fullwidth
            {...field}
          />
        )}
      </Field>
    </div>
  );
};

export default BanMessageField;
