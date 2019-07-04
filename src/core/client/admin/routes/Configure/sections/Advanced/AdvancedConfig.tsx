import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components";

import CommentStreamLiveUpdatesContainer from "./CommentStreamLiveUpdatesContainer";
import CustomCSSConfigContainer from "./CustomCSSConfigContainer";
import PermittedDomainsConfigContainer from "./PermittedDomainsConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof CustomCSSConfigContainer>["settings"] &
    PropTypesOf<typeof PermittedDomainsConfigContainer>["settings"] &
    PropTypesOf<typeof CommentStreamLiveUpdatesContainer>["settings"] &
    PropTypesOf<typeof CommentStreamLiveUpdatesContainer>["settingsReadOnly"];
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
    <CommentStreamLiveUpdatesContainer
      disabled={disabled}
      settings={settings}
      settingsReadOnly={settings}
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
