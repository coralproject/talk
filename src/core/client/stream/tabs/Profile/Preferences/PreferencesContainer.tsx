import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";
import NotificationSettingsContainer from "./NotificationSettingsContainer";

import { PreferencesContainer_viewer } from "coral-stream/__generated__/PreferencesContainer_viewer.graphql";

interface Props {
  viewer: PreferencesContainer_viewer;
}

const PreferencesContainer: FunctionComponent<Props> = props => {
  return (
    <HorizontalGutter spacing={4}>
      <NotificationSettingsContainer viewer={props.viewer} />
      <IgnoreUserSettingsContainer viewer={props.viewer} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment PreferencesContainer_viewer on User {
      ...NotificationSettingsContainer_viewer
      ...IgnoreUserSettingsContainer_viewer
    }
  `,
})(PreferencesContainer);

export default enhanced;
