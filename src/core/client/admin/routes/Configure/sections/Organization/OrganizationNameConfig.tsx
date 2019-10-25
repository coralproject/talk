import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormFieldDescription } from "coral-admin/ui/components";
import { required } from "coral-framework/lib/validation";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

interface Props {
  disabled: boolean;
}

const OrganizationNameConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-organization-name">
        <Header htmlFor="configure-organization-organization.name">
          Organization name
        </Header>
      </Localized>
    }
  >
    <Localized id="configure-organization-nameExplanation" strong={<strong />}>
      <FormFieldDescription>
        Your organization name will appear on emails sent by Coral to your
        community and organization members
      </FormFieldDescription>
    </Localized>
    <Field name="organization.name" validate={required}>
      {({ input, meta }) => (
        <TextFieldWithValidation
          id={`configure-organization-${input.name}`}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          meta={meta}
          fullWidth
          {...input}
        />
      )}
    </Field>
  </ConfigBox>
);

export default OrganizationNameConfig;
