import React from "react";
import { graphql } from "react-relay";

import { NewCommentersConfigContainer_settings as SettingsData } from "coral-admin/__generated__/NewCommentersConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import NewCommentersConfig from "./NewCommentersConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class NewCommentersConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <NewCommentersConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment NewCommentersConfigContainer_settings on Settings {
      newCommenters {
        premodEnabled
        approvedCommentsThreshold
      }
    }
  `,
})(NewCommentersConfigContainer);

export default enhanced;
