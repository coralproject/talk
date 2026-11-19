import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { CopyButton } from "coral-framework/components";
import { Flex, FormField, Label, TextField } from "coral-ui/components/v2";

interface Props {
  description?: React.ReactNode;
  url: string;
  /** label replaces the default "Redirect URI" label. */
  label?: React.ReactNode;
}

const RedirectField: FunctionComponent<Props> = ({
  url,
  description,
  label,
}) => (
  <FormField>
    {label ?? (
      <Localized id="configure-auth-redirectURI">
        <Label>Redirect URI</Label>
      </Localized>
    )}
    {description}
    <Flex direction="row" itemGutter="half" alignItems="center">
      <TextField name="redirectURI" value={url} fullWidth readOnly />
      <CopyButton text={url} />
    </Flex>
  </FormField>
);

export default RedirectField;
