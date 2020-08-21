import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { MediaLinksConfigContainer_settings as SettingsData } from "coral-admin/__generated__/MediaLinksConfigContainer_settings.graphql";

import MediaLinksConfig from "./MediaLinksConfig";

interface Props {
  settings: SettingsData;
  disabled: boolean;
}

const MediaLinksConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  return (
    <MediaLinksConfig
      externalMediaFeatureFlag={settings.featureFlags.includes(
        GQLFEATURE_FLAG.EXTERNAL_MEDIA
      )}
      disabled={disabled}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment MediaLinksConfigContainer_settings on Settings {
      featureFlags
    }
  `,
})(MediaLinksConfigContainer);

export default enhanced;
