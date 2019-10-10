import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { GuidelinesConfigContainer_settings as SettingsData } from "coral-admin/__generated__/GuidelinesConfigContainer_settings.graphql";

import GuidelinesConfig from "./GuidelinesConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class GuidelinesConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <GuidelinesConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment GuidelinesConfigContainer_settings on Settings {
      communityGuidelines {
        enabled
        content
      }
    }
  `,
})(GuidelinesConfigContainer);

export default enhanced;
