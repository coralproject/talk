import React from "react";
import { graphql } from "react-relay";

import { ReactionConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ReactionConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import ReactionConfig from "./ReactionConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class ReactionConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled, settings } = this.props;
    return <ReactionConfig settings={settings} disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ReactionConfigContainer_settings on Settings {
      reaction {
        label
        labelActive
        sortLabel
        icon
        iconActive
      }
    }
  `,
})(ReactionConfigContainer);

export default enhanced;
