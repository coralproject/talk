import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormField, Label } from "coral-admin/ui/components";
import { DurationField } from "coral-framework/components";
import { ValidationMessage } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "coral-framework/lib/validation";
import { FieldSet, HorizontalGutter } from "coral-ui/components";

import Header from "../../Header";
import SectionContent from "../../SectionContent";

interface Props {
  disabled?: boolean;
}

const SessionConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter>
    <HorizontalGutter spacing={3}>
      <Localized id="configure-auth-settings">
        <Header>Session settings</Header>
      </Localized>
    </HorizontalGutter>
    <SectionContent>
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
    </SectionContent>
  </HorizontalGutter>
);

export default SessionConfig;
