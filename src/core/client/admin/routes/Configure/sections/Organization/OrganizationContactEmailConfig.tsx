import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import {
  FormField,
  HorizontalGutter,
  TextField,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const OrganizationNameConfig: FunctionComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter size="full">
      <Localized id="configure-organization-email">
        <Header
          container={
            <label htmlFor="configure-organization-organization.contactEmail" />
          }
        >
          Organization Email
        </Header>
      </Localized>
      <Localized
        id="configure-organization-emailExplanation"
        strong={<strong />}
      >
        <Typography variant="detail">This Email will be used</Typography>
      </Localized>
      <Field
        name="organization.contactEmail"
        validate={composeValidators(required, validateEmail)}
      >
        {({ input, meta }) => (
          <>
            <TextField
              id={`configure-organization-${input.name}`}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              fullWidth
              {...input}
            />
            <ValidationMessage fullWidth meta={meta} />
          </>
        )}
      </Field>
    </HorizontalGutter>
  </FormField>
);

export default OrganizationNameConfig;
