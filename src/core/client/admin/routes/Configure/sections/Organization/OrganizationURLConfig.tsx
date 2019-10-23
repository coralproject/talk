import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { TextField } from "coral-admin/ui/components";
import {
  composeValidators,
  required,
  validateURL,
} from "coral-framework/lib/validation";

import ConfigBox from "../../ConfigBox";
import Description from "../../Description";
import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const OrganizationURLConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-organization-url">
        <Header htmlFor="configure-organization-organization.url">
          Organization URL
        </Header>
      </Localized>
    }
  >
    <Localized id="configure-organization-urlExplanation" strong={<strong />}>
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
  </ConfigBox>
);

export default OrganizationURLConfig;
