import React, { FunctionComponent } from "react";

import { FieldMeta, hasError } from "coral-framework/lib/form/helpers";
import { DeepPartial } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components/v2";
import TextField, { TextFieldProps } from "coral-ui/components/v2/TextField";

import ValidationMessage from "./ValidationMessage";

type OptionalTextFieldProps = Omit<TextFieldProps, "classes"> &
  DeepPartial<Pick<TextFieldProps, "classes">>;
interface Props extends OptionalTextFieldProps {
  meta: FieldMeta;
}

const FieldWithValidation: FunctionComponent<Props> = ({ meta, ...rest }) => {
  return (
    <HorizontalGutter spacing={2}>
      <TextField {...rest} color={hasError(meta) ? "error" : "regular"} />
      <ValidationMessage meta={meta} fullWidth />
    </HorizontalGutter>
  );
};

export default FieldWithValidation;
