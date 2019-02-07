import { FormApi } from "final-form";
import { RouteProps } from "found";
import { merge } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { AdvancedConfigContainer_settings as SettingsData } from "talk-admin/__generated__/AdvancedConfigContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import AdvancedConfig from "../components/AdvancedConfig";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SettingsData;
}

class AdvancedConfigContainer extends React.Component<Props> {
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
      <AdvancedConfig
        disabled={this.props.submitting}
        settings={this.props.settings}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AdvancedConfigContainer_settings on Settings {
      ...CustomCSSConfigContainer_settings
      ...PermittedDomainsConfigContainer_settings
    }
  `,
})(AdvancedConfigContainer);

export default enhanced;
