import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { DurationField } from "coral-framework/components";
import { ValidationMessage } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputLabel,
} from "coral-ui/components";

import Header from "../../Header";

interface Props {
  disabled?: boolean;
}

const SessionConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter>
    <HorizontalGutter size="full">
      <Localized id="configure-auth-settings">
        <Header>Session settings</Header>
      </Localized>
    </HorizontalGutter>
    <FormField container={<FieldSet />}>
      <Localized id="configure-auth-settings-session-duration-label">
        <InputLabel container="legend">Session Duration</InputLabel>
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
  </HorizontalGutter>
);

export default SessionConfig;
