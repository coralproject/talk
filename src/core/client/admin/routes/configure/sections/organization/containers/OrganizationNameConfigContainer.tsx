import React from "react";
import { graphql } from "react-relay";

import { OrganizationNameConfigContainer_settings as SettingsData } from "talk-admin/__generated__/OrganizationNameConfigContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import OrganizationNameConfig from "../components/OrganizationNameConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class OrganizationNameConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <OrganizationNameConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment OrganizationNameConfigContainer_settings on Settings {
      organizationName
    }
  `,
})(OrganizationNameConfigContainer);

export default enhanced;
