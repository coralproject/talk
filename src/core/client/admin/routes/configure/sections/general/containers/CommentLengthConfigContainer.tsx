import React from "react";
import { graphql } from "react-relay";

import { CommentLengthConfigContainer_settings as SettingsData } from "coral-admin/__generated__/CommentLengthConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import CommentLengthConfig from "../components/CommentLengthConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class CommentLengthConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <CommentLengthConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment CommentLengthConfigContainer_settings on Settings {
      charCount {
        enabled
        min
        max
      }
    }
  `,
})(CommentLengthConfigContainer);

export default enhanced;
