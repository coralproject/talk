import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import Header from "../../Header";
import ConfigBoxWithToggleField from "../Auth/ConfigBoxWithToggleField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment DSAConfigContainer_formValues on Settings {
    dsa {
      enabled
    }
  }
`;

interface Props {
  disabled: boolean;
}

export const DSAConfigContainer: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBoxWithToggleField
      data-testid="configure-general-dsaConfig"
      title={
        <Localized id="configure-general-dsaConfig-title">
          <Header container="h2">DSA Features (TODO)</Header>
        </Localized>
      }
      name="dsa.enabled"
      disabled={disabled}
    >
      {(disabledInside) => <>TODO</>}
    </ConfigBoxWithToggleField>
  );
};
