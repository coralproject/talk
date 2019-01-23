import React from "react";
import { graphql } from "react-relay";

import { SuspectWordListConfigContainer_settings as SettingsData } from "talk-admin/__generated__/SuspectWordListConfigContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import SuspectWordListConfig from "../components/SuspectWordListConfig";

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
