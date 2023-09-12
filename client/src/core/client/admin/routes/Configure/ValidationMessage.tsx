import React, { FunctionComponent } from "react";

import { FieldMeta, hasError } from "coral-framework/lib/form/helpers";
import { ValidationMessage as UIValidationMessage } from "coral-ui/components/v2";
import { ValidationMessageProps } from "coral-ui/components/v2/ValidationMessage";

interface Props extends Omit<ValidationMessageProps, "children"> {
  meta: FieldMeta;
}

const ValidationMessage: FunctionComponent<Props> = ({ meta, ...rest }) =>
  hasError(meta) ? (
    <UIValidationMessage {...rest}>
      {meta.error || meta.submitError}
    </UIValidationMessage>
  ) : null;

export default ValidationMessage;
