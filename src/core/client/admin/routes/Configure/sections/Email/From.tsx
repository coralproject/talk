import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseEmptyAsNull } from "coral-framework/lib/form";
import { validateEmail } from "coral-framework/lib/validation";
import {
  FormField,
  FormFieldHeader,
  HelperText,
  Label,
} from "coral-ui/components/v2";

import TextFieldWithValidation from "../../TextFieldWithValidation";

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
          <TextFieldWithValidation
            fullWidth
            disabled={disabled}
            meta={meta}
            {...input}
          />
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
          <TextFieldWithValidation
            type="email"
            fullWidth
            meta={meta}
            disabled={disabled}
            {...input}
          />
        )}
      </Field>
    </FormField>
  </>
);

export default From;
