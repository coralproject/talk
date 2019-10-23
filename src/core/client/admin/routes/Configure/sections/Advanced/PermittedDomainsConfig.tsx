import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormField, TextField } from "coral-admin/ui/components";
import {
  colorFromMeta,
  formatStringList,
  parseStringList,
  ValidationMessage,
} from "coral-framework/lib/form";
import { validateStrictURLList } from "coral-framework/lib/validation";

import ConfigBox from "../../ConfigBox";
import Description from "../../Description";
import Header from "../../Header";

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
        <Description>
          The domains you would like to permit for Coral, e.g. your local,
          staging and production environments including the scheme (ex.
          http://localhost:3000, https://staging.domain.com,
          https://domain.com).
        </Description>
      </Localized>
      <Field
        name="allowedDomains"
        parse={parseStringList}
        format={formatStringList}
        validate={validateStrictURLList}
      >
        {({ input, meta }) => (
          <>
            <TextField
              id={`configure-advanced-${input.name}`}
              disabled={disabled}
              color={colorFromMeta(meta)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              {...input}
              fullWidth
            />
            <ValidationMessage meta={meta} fullWidth />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default PermittedDomainsConfig;
