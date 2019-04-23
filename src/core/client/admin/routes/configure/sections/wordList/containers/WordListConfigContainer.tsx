import { FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { WordListConfigContainer_settings as SettingsData } from "talk-admin/__generated__/WordListConfigContainer_settings.graphql";
import { pureMerge } from "talk-common/utils";
import { withFragmentContainer } from "talk-framework/lib/relay";

import WordListConfig from "../components/WordListConfig";

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
