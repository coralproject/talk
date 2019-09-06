import React from "react";
import { graphql } from "react-relay";

import { OrganizationURLConfigContainer_settings as SettingsData } from "coral-admin/__generated__/OrganizationURLConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import OrganizationURLConfig from "./OrganizationURLConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class OrganizationURLConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <OrganizationURLConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment OrganizationURLConfigContainer_settings on Settings {
      organization {
        url
      }
    }
  `,
})(OrganizationURLConfigContainer);

export default enhanced;
