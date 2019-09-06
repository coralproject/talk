import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { required } from "coral-framework/lib/validation";
import {
  FormField,
  HorizontalGutter,
  TextField,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const OrganizationNameConfig: FunctionComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter size="full">
      <Localized id="configure-organization-name">
        <Header
          container={
            <label htmlFor="configure-organization-organization.name" />
          }
        >
          Organization name
        </Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-organization-nameExplanation"
          strong={<strong />}
        >
          <Typography variant="bodyShort">
            Your organization name will appear on emails sent by Coral to your
            community and organization members
          </Typography>
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
