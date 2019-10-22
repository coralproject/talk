import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormField, TextField } from "coral-admin/ui/components";
import {
  composeValidators,
  required,
  validateURL,
} from "coral-framework/lib/validation";
import { HorizontalGutter } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const OrganizationURLConfig: FunctionComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter spacing={3}>
      <Localized id="configure-organization-url">
        <Header htmlFor="configure-organization-organization.url">
          Organization URL
        </Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-organization-urlExplanation"
          strong={<strong />}
        >
          <Description>This URL will be used</Description>
        </Localized>
        <Field
          name="organization.url"
          validate={composeValidators(required, validateURL)}
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

export default OrganizationURLConfig;
