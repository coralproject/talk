import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { HorizontalGutter } from "talk-ui/components";

import CustomCSSConfigContainer from "../containers/CustomCSSConfigContainer";
import PermittedDomainsConfigContainer from "../containers/PermittedDomainsConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof CustomCSSConfigContainer>["settings"] &
    PropTypesOf<typeof PermittedDomainsConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const General: StatelessComponent<Props> = ({
  disabled,
  settings,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-GeneralContainer">
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

export default General;
