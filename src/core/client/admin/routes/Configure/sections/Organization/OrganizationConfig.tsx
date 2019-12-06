import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components/v2";

import OrganizationNameConfigContainer from "./OrganizationNameConfigContainer";

interface Props {
  disabled: boolean;
  organization: PropTypesOf<
    typeof OrganizationNameConfigContainer
  >["organization"];
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
  </HorizontalGutter>
);

export default OrganizationConfig;
