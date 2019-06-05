import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import {
  FormField,
  HorizontalGutter,
  TextField,
  Typography,
  ValidationMessage,
} from "coral-ui/components";

import Header from "../../../components/Header";

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

export default PermittedDomainsConfig;
