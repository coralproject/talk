import React from "react";
import { graphql } from "react-relay";

import { StoryCreationConfigContainer_settings as SettingsData } from "coral-admin/__generated__/StoryCreationConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import StoryCreationConfig from "./StoryCreationConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class StoryCreationConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <StoryCreationConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment StoryCreationConfigContainer_settings on Settings {
      stories {
        scraping {
          enabled
          proxyURL
        }
        disableLazy
      }
    }
  `,
})(StoryCreationConfigContainer);

export default enhanced;
