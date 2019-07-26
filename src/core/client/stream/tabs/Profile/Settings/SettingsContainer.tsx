import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { SettingsContainer_settings } from "coral-stream/__generated__/SettingsContainer_settings.graphql";
import { SettingsContainer_viewer } from "coral-stream/__generated__/SettingsContainer_viewer.graphql";
import { HorizontalGutter } from "coral-ui/components";

import ChangePasswordContainer from "./ChangePasswordContainer";
import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";

import styles from "./SettingsContainer.css";

interface Props {
  viewer: SettingsContainer_viewer;
  settings: SettingsContainer_settings;
}

const SettingsContainer: FunctionComponent<Props> = ({ viewer, settings }) => (
  <HorizontalGutter spacing={5} className={styles.root}>
    <IgnoreUserSettingsContainer viewer={viewer} />
    <ChangePasswordContainer settings={settings} />
  </HorizontalGutter>
);

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment SettingsContainer_viewer on User {
      ...IgnoreUserSettingsContainer_viewer
    }
  `,
  settings: graphql`
    fragment SettingsContainer_settings on Settings {
      ...ChangePasswordContainer_settings
    }
  `,
})(SettingsContainer);

export default enhanced;
