import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { OrganizationNameConfigContainer_settings as SettingsData } from "coral-admin/__generated__/OrganizationNameConfigContainer_settings.graphql";

import OrganizationNameConfig from "./OrganizationNameConfig";

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
      organization {
        name
      }
    }
  `,
})(OrganizationNameConfigContainer);

export default enhanced;
