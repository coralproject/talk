import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { PreModerationConfigContainer_settings as SettingsData } from "coral-admin/__generated__/PreModerationConfigContainer_settings.graphql";

import PreModerationConfig from "./PreModerationConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class PreModerationConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <PreModerationConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment PreModerationConfigContainer_settings on Settings {
      moderation
      premodLinksEnable
    }
  `,
})(PreModerationConfigContainer);

export default enhanced;
