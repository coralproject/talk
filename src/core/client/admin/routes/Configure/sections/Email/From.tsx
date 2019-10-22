import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormField, Label, TextField } from "coral-admin/ui/components";
import {
  colorFromMeta,
  parseEmptyAsNull,
  ValidationMessage,
} from "coral-framework/lib/form";
import { validateEmail } from "coral-framework/lib/validation";
import { FieldSet, HorizontalGutter } from "coral-ui/components";

import HelperText from "../../HelperText";

interface Props {
  disabled: boolean;
}

const From: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter spacing={4} container={<FieldSet />}>
    <FormField>
      <HorizontalGutter spacing={1}>
        <Localized id="configure-email-fromNameLabel">
          <Label>From name</Label>
        </Localized>
        <Localized id="configure-email-fromNameDescription">
          <HelperText>Name as it will appear on all outgoing emails</HelperText>
        </Localized>
      </HorizontalGutter>
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
      <HorizontalGutter spacing={1}>
        <Localized id="configure-email-fromEmailLabel">
          <Label>From email address</Label>
        </Localized>
        <Localized id="configure-email-fromEmailDescription">
          <HelperText>
            Email address that will be used to send messages
          </HelperText>
        </Localized>
      </HorizontalGutter>
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
