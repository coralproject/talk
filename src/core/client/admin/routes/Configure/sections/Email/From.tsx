import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { parseEmptyAsNull } from "coral-framework/lib/form";
import { validateEmail } from "coral-framework/lib/validation";
import {
  FormField,
  FormFieldHeader,
  HelperText,
  Label,
} from "coral-ui/components/v2";

import TextFieldWithValidation from "../../TextFieldWithValidation";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment From_formValues on EmailConfiguration {
    enabled
    fromName
    fromEmail
  }
`;

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
            {...input}
            fullWidth
            disabled={disabled}
            meta={meta}
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
            {...input}
            type="email"
            fullWidth
            meta={meta}
            disabled={disabled}
          />
        )}
      </Field>
    </FormField>
  </>
);

export default From;
