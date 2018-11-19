import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { CopyButton } from "talk-framework/components";
import { Flex, FormField, InputLabel, TextField } from "talk-ui/components";

interface Props {
  description?: React.ReactNode;
  url: string;
}

const RedirectField: StatelessComponent<Props> = ({ url, description }) => (
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
