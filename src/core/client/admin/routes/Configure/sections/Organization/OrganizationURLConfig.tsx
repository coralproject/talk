import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  composeValidators,
  required,
  validateURL,
} from "coral-framework/lib/validation";
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

const OrganizationURLConfig: FunctionComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter size="full">
      <Localized id="configure-organization-url">
        <Header
          container={
            <label htmlFor="configure-organization-organization.url" />
          }
        >
          Organization URL
        </Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-organization-urlExplanation"
          strong={<strong />}
        >
          <Typography variant="detail">This URL will be used</Typography>
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
