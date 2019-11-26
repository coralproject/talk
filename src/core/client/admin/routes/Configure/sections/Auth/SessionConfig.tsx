import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "coral-framework/lib/validation";
import {
  DurationField,
  FieldSet,
  FormField,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled?: boolean;
}

const SessionConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-auth-settings">
        <Header container="h2">Session settings</Header>
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
            <DurationField
              color={colorFromMeta(meta)}
              disabled={!!disabled}
              {...input}
            />
            <ValidationMessage meta={meta} fullWidth />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default SessionConfig;
