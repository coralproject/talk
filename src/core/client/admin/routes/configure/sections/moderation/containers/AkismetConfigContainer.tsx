import React from "react";
import { graphql } from "react-relay";

import { AkismetConfigContainer_settings as SettingsData } from "coral-admin/__generated__/AkismetConfigContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import AkismetConfig from "../components/AkismetConfig";

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled: boolean;
}

class AkismetConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <AkismetConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AkismetConfigContainer_settings on Settings {
      integrations {
        akismet {
          enabled
          key
          site
        }
      }
    }
  `,
})(AkismetConfigContainer);

export default enhanced;
