import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { PermittedDomainsConfigContainer_settings as SettingsData } from "coral-admin/__generated__/PermittedDomainsConfigContainer_settings.graphql";

import PermittedDomainsConfig from "./PermittedDomainsConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class PermittedDomainsConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <PermittedDomainsConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment PermittedDomainsConfigContainer_settings on Settings {
      allowedDomains
    }
  `,
})(PermittedDomainsConfigContainer);

export default enhanced;
