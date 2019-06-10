import React from "react";
import { graphql } from "react-relay";

import { ClosedStreamMessageConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ClosedStreamMessageConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import ClosedStreamMessageConfig from "./ClosedStreamMessageConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class ClosedStreamMessageConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <ClosedStreamMessageConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ClosedStreamMessageConfigContainer_settings on Settings {
      closeCommenting {
        message
      }
    }
  `,
})(ClosedStreamMessageConfigContainer);

export default enhanced;
