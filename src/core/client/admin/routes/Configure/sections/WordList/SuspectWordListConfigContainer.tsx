import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SuspectWordListConfigContainer_settings as SettingsData } from "coral-admin/__generated__/SuspectWordListConfigContainer_settings.graphql";

import SuspectWordListConfig from "./SuspectWordListConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class SuspectWordListConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <SuspectWordListConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment SuspectWordListConfigContainer_settings on Settings {
      wordList {
        suspect
      }
    }
  `,
})(SuspectWordListConfigContainer);

export default enhanced;
