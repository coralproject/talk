import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { CopyButton } from "talk-framework/components";
import { Flex, FormField, InputLabel, TextField } from "talk-ui/components";

interface Props {
  url: string;
}

const RedirectField: StatelessComponent<Props> = ({ url }) => (
  <FormField>
    <Localized id="configure-auth-redirectURI">
      <InputLabel>Redirect URI</InputLabel>
    </Localized>
    <Flex direction="row" itemGutter="half" alignItems="center">
      <TextField name="redirectURI" value={url} readOnly />
      <CopyButton text={url} />
    </Flex>
  </FormField>
);

export default RedirectField;
