import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components/v2";

import OrganizationContactEmailConfigContainer from "./OrganizationContactEmailConfigContainer";
import OrganizationNameConfigContainer from "./OrganizationNameConfigContainer";
import OrganizationURLConfigContainer from "./OrganizationURLConfigContainer";

interface Props {
  disabled: boolean;
  organization: PropTypesOf<
    typeof OrganizationNameConfigContainer
  >["organization"] &
    PropTypesOf<
      typeof OrganizationContactEmailConfigContainer
    >["organization"] &
    PropTypesOf<typeof OrganizationURLConfigContainer>["organization"];
  onInitValues: (values: any) => void;
}

const OrganizationConfig: FunctionComponent<Props> = ({
  disabled,
  organization,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-organizationContainer">
    <OrganizationNameConfigContainer
      disabled={disabled}
      organization={organization}
      onInitValues={onInitValues}
    />
    <OrganizationContactEmailConfigContainer
      disabled={disabled}
      organization={organization}
      onInitValues={onInitValues}
    />
    <OrganizationURLConfigContainer
      disabled={disabled}
      organization={organization}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default OrganizationConfig;
