import React from "react";
import { graphql } from "react-relay";

import { AccountFeaturesConfigContainer_settings as SettingsData } from "coral-admin/__generated__/AccountFeaturesConfigContainer_settings.graphql";
import { DeepNullable, DeepPartial } from "coral-common/types";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { GQLSettings } from "coral-framework/schema";
import AccountFeaturesConfig from "./AccountFeaturesConfig";

export type FormProps = DeepNullable<Pick<GQLSettings, "accountFeatures">>;
export type OnInitValuesFct = (values: DeepPartial<FormProps>) => void;

interface Props {
  settings: SettingsData;
  onInitValues: (values: SettingsData) => void;
  disabled?: boolean;
}

class AccountFeaturesConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const { disabled } = this.props;
    return <AccountFeaturesConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AccountFeaturesConfigContainer_settings on Settings {
      accountFeatures {
        changeUsername
        deleteAccount
        downloadComments
      }
    }
  `,
})(AccountFeaturesConfigContainer);

export default enhanced;
