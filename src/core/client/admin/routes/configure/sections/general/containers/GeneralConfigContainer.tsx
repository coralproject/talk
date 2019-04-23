import { FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { GeneralConfigContainer_settings as SettingsData } from "talk-admin/__generated__/GeneralConfigContainer_settings.graphql";
import { pureMerge } from "talk-common/utils";
import { withFragmentContainer } from "talk-framework/lib/relay";

import GeneralConfig from "../components/GeneralConfig";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SettingsData;
}

class GeneralConfigContainer extends React.Component<Props> {
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
      <GeneralConfig
        disabled={this.props.submitting}
        settings={this.props.settings}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment GeneralConfigContainer_settings on Settings {
      ...GuidelinesConfigContainer_settings
      ...CommentLengthConfigContainer_settings
      ...CommentEditingConfigContainer_settings
      ...ClosedStreamMessageConfigContainer_settings
      ...ClosingCommentStreamsConfigContainer_settings
      ...SitewideCommentingConfigContainer_settings
    }
  `,
})(GeneralConfigContainer);

export default enhanced;
