import React from "react";
import { graphql } from "react-relay";

import { SitewideCommentingConfigContainer_settings as SettingsData } from "coral-admin/__generated__/SitewideCommentingConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import SitewideCommentingConfig from "../components/SitewideCommentingConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class SitewideCommentingConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <SitewideCommentingConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment SitewideCommentingConfigContainer_settings on Settings {
      disableCommenting {
        enabled
        message
      }
    }
  `,
})(SitewideCommentingConfigContainer);

export default enhanced;
