import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { RecentCommentHistoryConfigContainer_settings as SettingsData } from "coral-admin/__generated__/RecentCommentHistoryConfigContainer_settings.graphql";

import RecentCommentHistoryConfig from "./RecentCommentHistoryConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class RecentCommentHistoryConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <RecentCommentHistoryConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment RecentCommentHistoryConfigContainer_settings on Settings {
      recentCommentHistory {
        enabled
        timeFrame
        triggerRejectionRate
      }
    }
  `,
})(RecentCommentHistoryConfigContainer);

export default enhanced;
