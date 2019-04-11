import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { required } from "talk-framework/lib/validation";
import {
  FormField,
  HorizontalGutter,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import Header from "../../../components/Header";

interface Props {
  disabled: boolean;
}

const OrganizationNameConfig: StatelessComponent<Props> = ({ disabled }) => (
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
        <Typography variant="detail">This E-Mail will be used</Typography>
      </Localized>
      <Field name="organization.contactEmail" validate={required}>
        {({ input, meta }) => (
          <>
            <TextField
              id={`configure-organization-${input.name}`}
              name={input.name}
              onChange={input.onChange}
              value={input.value}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              fullWidth
            />
            {meta.touched && (meta.error || meta.submitError) && (
              <ValidationMessage fullWidth>
                {meta.error || meta.submitError}
              </ValidationMessage>
            )}
          </>
        )}
      </Field>
    </HorizontalGutter>
  </FormField>
);

export default OrganizationNameConfig;
