import React from "react";
import { graphql } from "react-relay";

import { ClosingCommentStreamsConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ClosingCommentStreamsConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import ClosingCommentStreamsConfig from "./ClosingCommentStreamsConfig";

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
      closeCommenting {
        auto
        timeout
      }
    }
  `,
})(ClosingCommentStreamsConfigContainer);

export default enhanced;
