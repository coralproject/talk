import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { HorizontalGutter } from "talk-ui/components";

import OrganizationContactEmailConfigContainer from "../containers/OrganizationContactEmailConfigContainer";
import OrganizationNameConfigContainer from "../containers/OrganizationNameConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof OrganizationNameConfigContainer>["settings"] &
    PropTypesOf<typeof OrganizationContactEmailConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const General: StatelessComponent<Props> = ({
  disabled,
  settings,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-GeneralContainer">
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
  </HorizontalGutter>
);

export default General;
