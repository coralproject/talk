import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components/v2";

import OrganizationContactEmailConfigContainer from "./OrganizationContactEmailConfigContainer";
import OrganizationNameConfigContainer from "./OrganizationNameConfigContainer";
import OrganizationURLConfigContainer from "./OrganizationURLConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof OrganizationNameConfigContainer>["settings"] &
    PropTypesOf<typeof OrganizationContactEmailConfigContainer>["settings"] &
    PropTypesOf<typeof OrganizationURLConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const OrganizationConfig: FunctionComponent<Props> = ({
  disabled,
  settings,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-organizationContainer">
    <OrganizationNameConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <OrganizationContactEmailConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <OrganizationURLConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default OrganizationConfig;
