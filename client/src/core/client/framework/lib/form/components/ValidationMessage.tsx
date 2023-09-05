import React, { FunctionComponent } from "react";

import { FieldMeta, hasError } from "coral-framework/lib/form/helpers";
import { PropTypesOf } from "coral-framework/types";
import { ValidationMessage as UIValidationMessage } from "coral-ui/components/v2";

interface Props
  extends Omit<PropTypesOf<typeof UIValidationMessage>, "children" | "ref"> {
  meta: FieldMeta;
}

const ValidationMessage: FunctionComponent<Props> = ({ meta, ...rest }) =>
  hasError(meta) ? (
    <UIValidationMessage {...rest}>
      {meta.error || meta.submitError}
    </UIValidationMessage>
  ) : null;

export default ValidationMessage;
