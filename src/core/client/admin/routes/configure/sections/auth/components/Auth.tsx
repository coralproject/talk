import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { HorizontalGutter } from "talk-ui/components";

import DisplayNamesConfigContainer from "../containers/DisplayNamesConfigContainer";
import AuthIntegrationsConfig from "./AuthIntegrationsConfig";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof AuthIntegrationsConfig>["auth"] &
    PropTypesOf<typeof DisplayNamesConfigContainer>["auth"];
  onInitValues: (values: any) => void;
}

const Auth: StatelessComponent<Props> = ({ disabled, auth, onInitValues }) => (
  <HorizontalGutter size="double">
    <DisplayNamesConfigContainer
      disabled={disabled}
      auth={auth}
      onInitValues={onInitValues}
    />
    <AuthIntegrationsConfig
      disabled={disabled}
      auth={auth}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default Auth;
