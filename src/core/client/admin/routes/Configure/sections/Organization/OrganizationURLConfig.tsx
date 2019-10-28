import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  composeValidators,
  required,
  validateURL,
} from "coral-framework/lib/validation";
import { FormFieldDescription } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

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
      <FormFieldDescription>This URL will be used</FormFieldDescription>
    </Localized>
    <Field
      name="organization.url"
      validate={composeValidators(required, validateURL)}
    >
      {({ input, meta }) => (
        <TextFieldWithValidation
          id={`configure-organization-${input.name}`}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          fullWidth
          meta={meta}
          {...input}
        />
      )}
    </Field>
  </ConfigBox>
);

export default OrganizationURLConfig;
