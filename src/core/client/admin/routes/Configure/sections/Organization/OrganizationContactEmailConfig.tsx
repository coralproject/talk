import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormField, TextField } from "coral-admin/ui/components";
import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import { HorizontalGutter } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const OrganizationNameConfig: FunctionComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter size="full">
      <Localized id="configure-organization-email">
        <Header htmlFor="configure-organization-organization.contactEmail">
          Organization email
        </Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-organization-emailExplanation"
          strong={<strong />}
        >
          <Description>
            This email address will be used as in emails and across the platform
            for community members to get in touch with the organization should
            they have any questions about the status of their accounts or
            moderation questions.
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
      </SectionContent>
    </HorizontalGutter>
  </FormField>
);

export default OrganizationNameConfig;
