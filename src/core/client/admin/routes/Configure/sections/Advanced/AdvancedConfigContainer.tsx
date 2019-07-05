import { FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { AdvancedConfigContainer_settings } from "coral-admin/__generated__/AdvancedConfigContainer_settings.graphql";
import { pureMerge } from "coral-common/utils";
import { withFragmentContainer } from "coral-framework/lib/relay";

import AdvancedConfig from "./AdvancedConfig";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: AdvancedConfigContainer_settings;
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
    this.initialValues = pureMerge(this.initialValues, values);
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
      ...CommentStreamLiveUpdatesContainer_settings
      ...CommentStreamLiveUpdatesContainer_settingsReadOnly
    }
  `,
})(AdvancedConfigContainer);

export default enhanced;
