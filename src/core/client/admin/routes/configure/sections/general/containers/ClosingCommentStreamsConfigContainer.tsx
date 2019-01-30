import React from "react";
import { graphql } from "react-relay";

import { ClosingCommentStreamsConfigContainer_settings as SettingsData } from "talk-admin/__generated__/ClosingCommentStreamsConfigContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import ClosingCommentStreamsConfig from "../components/ClosingCommentStreamsConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class ClosingCommentStreamsConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <ClosingCommentStreamsConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ClosingCommentStreamsConfigContainer_settings on Settings {
      autoCloseStream
      closedTimeout
    }
  `,
})(ClosingCommentStreamsConfigContainer);

export default enhanced;
