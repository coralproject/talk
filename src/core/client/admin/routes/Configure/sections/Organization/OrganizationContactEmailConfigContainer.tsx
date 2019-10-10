import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { OrganizationContactEmailConfigContainer_settings as SettingsData } from "coral-admin/__generated__/OrganizationContactEmailConfigContainer_settings.graphql";

import OrganizationContactEmailConfig from "./OrganizationContactEmailConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class OrganizationContactEmailConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <OrganizationContactEmailConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment OrganizationContactEmailConfigContainer_settings on Settings {
      organization {
        contactEmail
      }
    }
  `,
})(OrganizationContactEmailConfigContainer);

export default enhanced;
