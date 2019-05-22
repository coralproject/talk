import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { CopyButton } from "coral-framework/components";
import { Flex, FormField, InputLabel, TextField } from "coral-ui/components";

interface Props {
  description?: React.ReactNode;
  url: string;
}

const RedirectField: FunctionComponent<Props> = ({ url, description }) => (
  <FormField>
    <Localized id="configure-auth-redirectURI">
      <InputLabel>Redirect URI</InputLabel>
    </Localized>
    {description}
    <Flex direction="row" itemGutter="half" alignItems="center">
      <TextField name="redirectURI" value={url} readOnly />
      <CopyButton text={url} />
    </Flex>
  </FormField>
);

export default RedirectField;
