import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { required } from "coral-framework/lib/validation";
import { FormFieldDescription } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment OrganizationNameConfig_formValues on Settings {
    organization {
      name
    }
  }
`;

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
    <Localized
      id="configure-organization-nameExplanation"
      elems={{ strong: <strong /> }}
    >
      <FormFieldDescription>
        Your organization name will appear on emails sent by Coral to your
        community and organization members
      </FormFieldDescription>
    </Localized>
    <Field name="organization.name" validate={required}>
      {({ input, meta }) => (
        <TextFieldWithValidation
          {...input}
          id={`configure-organization-${input.name}`}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          meta={meta}
          fullWidth
        />
      )}
    </Field>
  </ConfigBox>
);

export default OrganizationNameConfig;
