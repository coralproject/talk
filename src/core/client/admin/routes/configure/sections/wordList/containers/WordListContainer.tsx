import { FormApi } from "final-form";
import { RouteProps } from "found";
import { merge } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { WordListContainer_settings as SettingsData } from "talk-admin/__generated__/WordListContainer_settings.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import WordList from "../components/WordList";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SettingsData;
}

class WordListContainer extends React.Component<Props> {
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
      <WordList
        disabled={this.props.submitting}
        settings={this.props.settings}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment WordListContainer_settings on Settings {
      ...SuspectWordListConfigContainer_settings
      ...BannedWordListConfigContainer_settings
    }
  `,
})(WordListContainer);

export default enhanced;
