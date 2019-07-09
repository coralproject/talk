import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components";

import AkismetConfigContainer from "./AkismetConfigContainer";
import PerspectiveConfigContainer from "./PerspectiveConfigContainer";
import PreModerationConfigContainer from "./PreModerationConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof AkismetConfigContainer>["settings"] &
    PropTypesOf<typeof PerspectiveConfigContainer>["settings"] &
    PropTypesOf<typeof PreModerationConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const ModerationConfig: FunctionComponent<Props> = ({
  disabled,
  settings,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-moderationContainer">
    <PreModerationConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <PerspectiveConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <AkismetConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default ModerationConfig;
