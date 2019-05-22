import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components";

import CustomCSSConfigContainer from "../containers/CustomCSSConfigContainer";
import PermittedDomainsConfigContainer from "../containers/PermittedDomainsConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof CustomCSSConfigContainer>["settings"] &
    PropTypesOf<typeof PermittedDomainsConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const AdvancedConfig: FunctionComponent<Props> = ({
  disabled,
  settings,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-advancedContainer">
    <CustomCSSConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <PermittedDomainsConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default AdvancedConfig;
