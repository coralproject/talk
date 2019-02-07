import React from "react";
import { graphql } from "react-relay";

import { CustomCSSConfigContainer_settings as SettingsData } from "talk-admin/__generated__/CustomCSSConfigContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import CustomCSSConfig from "../components/CustomCSSConfig";

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
      customCssUrl
    }
  `,
})(CustomCSSConfigContainer);

export default enhanced;
