import React from "react";
import { graphql } from "react-relay";

import { PerspectiveConfigContainer_settings as SettingsData } from "talk-admin/__generated__/PerspectiveConfigContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import PerspectiveConfig from "../components/PerspectiveConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class PerspectiveConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <PerspectiveConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment PerspectiveConfigContainer_settings on Settings {
      integrations {
        perspective {
          enabled
          endpoint
          key
          threshold
          doNotStore
        }
      }
    }
  `,
})(PerspectiveConfigContainer);

export default enhanced;
