import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FieldSet, FormField, Label } from "coral-admin/ui/components";
import { DurationField } from "coral-framework/components";
import { ValidationMessage } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "coral-framework/lib/validation";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";

interface Props {
  disabled?: boolean;
}

const SessionConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-auth-settings">
        <Header>Session settings</Header>
      </Localized>
    }
  >
    <FormField container={<FieldSet />}>
      <Localized id="configure-auth-settings-session-duration-label">
        <Label component="legend">Session Duration</Label>
      </Localized>
      <Field
        name="auth.sessionDuration"
        validate={composeValidators(
          required,
          validateWholeNumberGreaterThanOrEqual(0)
        )}
      >
        {({ input, meta }) => (
          <>
            <DurationField disabled={!!disabled} {...input} />
            <ValidationMessage meta={meta} />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default SessionConfig;
