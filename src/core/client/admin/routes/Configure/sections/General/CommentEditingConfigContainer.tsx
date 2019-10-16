import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { CommentEditingConfigContainer_settings as SettingsData } from "coral-admin/__generated__/CommentEditingConfigContainer_settings.graphql";

import CommentEditingConfig from "./CommentEditingConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class CommentEditingConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <CommentEditingConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment CommentEditingConfigContainer_settings on Settings {
      editCommentWindowLength
    }
  `,
})(CommentEditingConfigContainer);

export default enhanced;
