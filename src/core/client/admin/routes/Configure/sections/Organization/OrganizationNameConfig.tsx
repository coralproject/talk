import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormField, TextField } from "coral-admin/ui/components";
import { required } from "coral-framework/lib/validation";
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
    <HorizontalGutter spacing={3}>
      <Localized id="configure-organization-name">
        <Header htmlFor="configure-organization-organization.name">
          Organization name
        </Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-organization-nameExplanation"
          strong={<strong />}
        >
          <Description>
            Your organization name will appear on emails sent by Coral to your
            community and organization members
          </Description>
        </Localized>
        <Field name="organization.name" validate={required}>
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
              <ValidationMessage meta={meta} fullWidth />
            </>
          )}
        </Field>
      </SectionContent>
    </HorizontalGutter>
  </FormField>
);

export default OrganizationNameConfig;
