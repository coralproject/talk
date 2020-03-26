import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { PreferencesContainer_viewer } from "coral-stream/__generated__/PreferencesContainer_viewer.graphql";

import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";
import NotificationSettingsContainer from "./NotificationSettingsContainer";

interface Props {
  viewer: PreferencesContainer_viewer;
}

const PreferencesContainer: FunctionComponent<Props> = (props) => {
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
