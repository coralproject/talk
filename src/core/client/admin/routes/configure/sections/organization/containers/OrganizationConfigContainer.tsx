import { FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { OrganizationConfigContainer_settings as SettingsData } from "talk-admin/__generated__/OrganizationConfigContainer_settings.graphql";
import { pureMerge } from "talk-common/utils";
import { withFragmentContainer } from "talk-framework/lib/relay";

import OrganizationConfig from "../components/OrganizationConfig";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SettingsData;
}

class OrganizationConfigContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private initialValues = {};

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {
    this.props.form.initialize(this.initialValues);
  }

  private handleOnInitValues = (values: any) => {
    this.initialValues = pureMerge(this.initialValues, values);
  };

  public render() {
    return (
      <OrganizationConfig
        disabled={this.props.submitting}
        settings={this.props.settings}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment OrganizationConfigContainer_settings on Settings {
      ...OrganizationNameConfigContainer_settings
      ...OrganizationContactEmailConfigContainer_settings
    }
  `,
})(OrganizationConfigContainer);

export default enhanced;
