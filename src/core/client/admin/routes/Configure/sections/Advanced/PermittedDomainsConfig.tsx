import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  colorFromMeta,
  formatStringList,
  parseStringList,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  FormField,
  HorizontalGutter,
  TextField,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";

interface Props {
  disabled: boolean;
}

const PermittedDomainsConfig: FunctionComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter size="full">
      <Localized id="configure-advanced-permittedDomains">
        <Header
          container={<label htmlFor="configure-advanced-allowedDomains" />}
        >
          Permitted Domains
        </Header>
      </Localized>
      <Localized
        id="configure-advanced-permittedDomains-explanation"
        strong={<strong />}
      >
        <Typography variant="detail">
          Domains where your Coral instance is allowed to be embedded. Typical
          use is localhost, staging.yourdomain.com, yourdomain.com, etc.
        </Typography>
      </Localized>
      <Field
        name="allowedDomains"
        parse={parseStringList}
        format={formatStringList}
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
    </HorizontalGutter>
  </FormField>
);

export default PermittedDomainsConfig;
