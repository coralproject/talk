import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { FormField, Label, TextField } from "coral-admin/ui/components";
import { CopyButton } from "coral-framework/components";
import { Flex } from "coral-ui/components";

interface Props {
  description?: React.ReactNode;
  url: string;
}

const RedirectField: FunctionComponent<Props> = ({ url, description }) => (
  <FormField>
    <Localized id="configure-auth-redirectURI">
      <Label>Redirect URI</Label>
    </Localized>
    {description}
    <Flex direction="row" itemGutter="half" alignItems="center">
      <TextField name="redirectURI" value={url} fullWidth readOnly />
      <CopyButton size="regular" text={url} />
    </Flex>
  </FormField>
);

export default RedirectField;
