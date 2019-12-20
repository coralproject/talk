import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { validateStrictURLList } from "coral-framework/lib/validation";
import { FormField, FormFieldDescription } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PermittedDomainsConfig_formValues on Settings {
    allowedDomains
  }
`;

interface Props {
  disabled: boolean;
}

const PermittedDomainsConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-advanced-permittedDomains">
        <Header htmlFor="configure-advanced-allowedDomains">
          Permitted domains
        </Header>
      </Localized>
    }
  >
    <FormField>
      <Localized
        id="configure-advanced-permittedDomains-description"
        strong={<strong />}
      >
        <FormFieldDescription>
          The domains you would like to permit for Coral, e.g. your local,
          staging and production environments including the scheme (ex.
          http://localhost:3000, https://staging.domain.com,
          https://domain.com).
        </FormFieldDescription>
      </Localized>
      <Field
        name="allowedDomains"
        parse={parseStringList}
        format={formatStringList}
        validate={validateStrictURLList}
      >
        {({ input, meta }) => (
          <TextFieldWithValidation
            {...input}
            id={`configure-advanced-${input.name}`}
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
    </FormField>
  </ConfigBox>
);

export default PermittedDomainsConfig;
