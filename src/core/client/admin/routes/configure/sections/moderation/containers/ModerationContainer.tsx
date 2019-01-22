import { FormApi } from "final-form";
import { RouteProps } from "found";
import { merge } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { ModerationContainer_settings as SettingsData } from "talk-admin/__generated__/ModerationContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import Moderation from "../components/Moderation";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SettingsData;
}

class ModerationContainer extends React.Component<Props> {
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
      <Moderation
        disabled={this.props.submitting}
        settings={this.props.settings}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ModerationContainer_settings on Settings {
      ...AkismetConfigContainer_settings
      ...PerspectiveConfigContainer_settings
    }
  `,
})(ModerationContainer);

export default enhanced;
