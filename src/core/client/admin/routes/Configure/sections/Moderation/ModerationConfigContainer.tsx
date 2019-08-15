import { FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { ModerationConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ModerationConfigContainer_settings.graphql";
import { pureMerge } from "coral-common/utils";
import { withFragmentContainer } from "coral-framework/lib/relay";

import ModerationConfig from "./ModerationConfig";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SettingsData;
}

class ModerationConfigContainer extends React.Component<Props> {
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
      <ModerationConfig
        disabled={this.props.submitting}
        settings={this.props.settings}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ModerationConfigContainer_settings on Settings {
      ...AkismetConfigContainer_settings
      ...PerspectiveConfigContainer_settings
      ...PreModerationConfigContainer_settings
      ...RecentCommentHistoryConfigContainer_settings
    }
  `,
})(ModerationConfigContainer);

export default enhanced;
