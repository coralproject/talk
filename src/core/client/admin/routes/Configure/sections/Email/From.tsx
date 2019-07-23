import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { validateEmail } from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  ValidationMessage,
} from "coral-ui/components";

interface Props {
  disabled: boolean;
}

const From: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
    <FormField>
      <Localized id="configure-email-fromNameLabel">
        <InputLabel>From name</InputLabel>
      </Localized>
      <Localized id="configure-email-fromNameDescription">
        <InputDescription>
          Name as it will appear on all outgoing emails
        </InputDescription>
      </Localized>
      <Field name="email.fromName">
        {({ input, meta }) => (
          <>
            <TextField fullWidth disabled={disabled} {...input} />
            {meta.touched && (meta.error || meta.submitError) && (
              <ValidationMessage fullWidth>
                {meta.error || meta.submitError}
              </ValidationMessage>
            )}
          </>
        )}
      </Field>
    </FormField>
    <FormField>
      <Localized id="configure-email-fromEmailLabel">
        <InputLabel>From email address</InputLabel>
      </Localized>
      <Localized id="configure-email-fromEmailDescription">
        <InputDescription>
          Email address that will be used to send messages
        </InputDescription>
      </Localized>
      <Field name="email.fromEmail" validate={validateEmail}>
        {({ input, meta }) => (
          <>
            <TextField
              type="email"
              fullWidth
              color={
                meta.touched && (meta.error || meta.submitError)
                  ? "error"
                  : "regular"
              }
              disabled={disabled}
              {...input}
            />
            {meta.touched && (meta.error || meta.submitError) && (
              <ValidationMessage fullWidth>
                {meta.error || meta.submitError}
              </ValidationMessage>
            )}
          </>
        )}
      </Field>
    </FormField>
  </HorizontalGutter>
);

export default From;
