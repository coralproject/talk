import React from "react";
import { graphql } from "react-relay";

import { PermittedDomainsConfigContainer_settings as SettingsData } from "talk-admin/__generated__/PermittedDomainsConfigContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import PermittedDomainsConfig from "../components/PermittedDomainsConfig";

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
      domains
    }
  `,
})(PermittedDomainsConfigContainer);

export default enhanced;
