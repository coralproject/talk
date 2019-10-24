import React, { FunctionComponent } from "react";

import { ValidationMessage as UIValidationMessage } from "coral-admin/ui/components";
import { ValidationMessageProps } from "coral-admin/ui/components/ValidationMessage";
import { FieldMeta, hasError } from "coral-framework/lib/form/helpers";
import { Omit } from "coral-framework/types";

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
