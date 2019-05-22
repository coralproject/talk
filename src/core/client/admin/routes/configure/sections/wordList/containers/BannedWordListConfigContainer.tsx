import React from "react";
import { graphql } from "react-relay";

import { BannedWordListConfigContainer_settings as SettingsData } from "coral-admin/__generated__/BannedWordListConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import BannedWordListConfig from "../components/BannedWordListConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class BannedWordListConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <BannedWordListConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment BannedWordListConfigContainer_settings on Settings {
      wordList {
        banned
      }
    }
  `,
})(BannedWordListConfigContainer);

export default enhanced;
