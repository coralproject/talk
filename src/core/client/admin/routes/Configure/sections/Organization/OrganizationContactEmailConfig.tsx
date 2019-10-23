import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { TextField } from "coral-admin/ui/components";
import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";

import ConfigBox from "../../ConfigBox";
import Description from "../../Description";
import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const OrganizationNameConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-organization-email">
        <Header htmlFor="configure-organization-organization.contactEmail">
          Organization email
        </Header>
      </Localized>
    }
  >
    <Localized id="configure-organization-emailExplanation" strong={<strong />}>
      <Description>
        This email address will be used as in emails and across the platform for
        community members to get in touch with the organization should they have
        any questions about the status of their accounts or moderation
        questions.
      </Description>
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
  </ConfigBox>
);

export default OrganizationNameConfig;
