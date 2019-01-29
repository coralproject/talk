import React from "react";
import { graphql } from "react-relay";

import { OrganizationContactEmailConfigContainer_settings as SettingsData } from "talk-admin/__generated__/OrganizationContactEmailConfigContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import OrganizationContactEmailConfig from "../components/OrganizationContactEmailConfig";

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
      organizationContactEmail
    }
  `,
})(OrganizationContactEmailConfigContainer);

export default enhanced;
