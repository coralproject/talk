import { FormApi } from "final-form";
import { RouteProps } from "found";
import { merge } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { OrganizationContainer_settings as SettingsData } from "talk-admin/__generated__/OrganizationContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import Organization from "../components/Organization";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SettingsData;
}

class OrganizationContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private initialValues = {};

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {
    this.props.form.initialize(this.initialValues);
  }

  private handleOnInitValues = (values: any) => {
    this.initialValues = merge({}, this.initialValues, values);
  };

  public render() {
    return (
      <Organization
        disabled={this.props.submitting}
        settings={this.props.settings}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment OrganizationContainer_settings on Settings {
      ...OrganizationNameConfigContainer_settings
      ...OrganizationContactEmailConfigContainer_settings
    }
  `,
})(OrganizationContainer);

export default enhanced;
