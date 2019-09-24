import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  colorFromMeta,
  parseEmptyAsNull,
  ValidationMessage,
} from "coral-framework/lib/form";
import { validateEmail } from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
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
      <Field name="email.fromName" parse={parseEmptyAsNull}>
        {({ input, meta }) => (
          <>
            <TextField
              fullWidth
              disabled={disabled}
              color={colorFromMeta(meta)}
              {...input}
            />
            <ValidationMessage fullWidth meta={meta} />
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
      <Field
        name="email.fromEmail"
        parse={parseEmptyAsNull}
        validate={validateEmail}
      >
        {({ input, meta }) => (
          <>
            <TextField
              type="email"
              fullWidth
              color={colorFromMeta(meta)}
              disabled={disabled}
              {...input}
            />
            <ValidationMessage fullWidth meta={meta} />
          </>
        )}
      </Field>
    </FormField>
  </HorizontalGutter>
);

export default From;
