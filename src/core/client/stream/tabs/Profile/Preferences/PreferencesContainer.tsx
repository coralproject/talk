import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import {} from "coral-ui/components/v2";

import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";
import NotificationSettingsContainer from "./NotificationSettingsContainer";

import { PreferencesContainer_viewer } from "coral-stream/__generated__/PreferencesContainer_viewer.graphql";
// import styles from "./PreferencesContainer.css";

interface Props {
  viewer: PreferencesContainer_viewer;
}

const PreferencesContainer: FunctionComponent<Props> = props => {
  return (
    <div>
      <NotificationSettingsContainer viewer={props.viewer} />
      <IgnoreUserSettingsContainer viewer={props.viewer} />
    </div>
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
