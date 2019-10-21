import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { CustomCSSConfigContainer_settings as SettingsData } from "coral-admin/__generated__/CustomCSSConfigContainer_settings.graphql";

import CustomCSSConfig from "./CustomCSSConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class CustomCSSConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <CustomCSSConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment CustomCSSConfigContainer_settings on Settings {
      customCSSURL
    }
  `,
})(CustomCSSConfigContainer);

export default enhanced;
