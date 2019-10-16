import { FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { pureMerge } from "coral-common/utils";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { WordListConfigContainer_settings as SettingsData } from "coral-admin/__generated__/WordListConfigContainer_settings.graphql";

import WordListConfig from "./WordListConfig";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SettingsData;
}

class WordListConfigContainer extends React.Component<Props> {
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
      <WordListConfig
        disabled={this.props.submitting}
        settings={this.props.settings}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment WordListConfigContainer_settings on Settings {
      ...SuspectWordListConfigContainer_settings
      ...BannedWordListConfigContainer_settings
    }
  `,
})(WordListConfigContainer);

export default enhanced;
