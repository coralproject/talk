import React from "react";
import { graphql } from "react-relay";

import { StaffConfigContainer_settings as SettingsData } from "coral-admin/__generated__/StaffConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import StaffConfig from "./StaffConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class StaffConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled, settings } = this.props;
    return <StaffConfig settings={settings} disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment StaffConfigContainer_settings on Settings {
      staff {
        label
      }
    }
  `,
})(StaffConfigContainer);

export default enhanced;
