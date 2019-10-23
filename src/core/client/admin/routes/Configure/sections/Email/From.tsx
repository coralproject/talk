import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  FormField,
  FormFieldHeader,
  HelperText,
  Label,
  TextField,
} from "coral-admin/ui/components";
import {
  colorFromMeta,
  parseEmptyAsNull,
  ValidationMessage,
} from "coral-framework/lib/form";
import { validateEmail } from "coral-framework/lib/validation";

interface Props {
  disabled: boolean;
}

const From: FunctionComponent<Props> = ({ disabled }) => (
  <>
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-email-fromNameLabel">
          <Label>From name</Label>
        </Localized>
        <Localized id="configure-email-fromNameDescription">
          <HelperText>Name as it will appear on all outgoing emails</HelperText>
        </Localized>
      </FormFieldHeader>
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
      <FormFieldHeader>
        <Localized id="configure-email-fromEmailLabel">
          <Label>From email address</Label>
        </Localized>
        <Localized id="configure-email-fromEmailDescription">
          <HelperText>
            Email address that will be used to send messages
          </HelperText>
        </Localized>
      </FormFieldHeader>
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
  </>
);

export default From;
