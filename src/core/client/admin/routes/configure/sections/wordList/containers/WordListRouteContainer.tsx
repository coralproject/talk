import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { WordListRouteContainerQueryResponse } from "talk-admin/__generated__/WordListRouteContainerQuery.graphql";
import { withRouteConfig } from "talk-framework/lib/router";
import { Delay, Spinner } from "talk-ui/components";

import WordListConfigContainer from "./WordListConfigContainer";

interface Props {
  data: WordListRouteContainerQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

class WordListRouteContainer extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <WordListConfigContainer
        settings={this.props.data.settings}
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig({
  query: graphql`
    query WordListRouteContainerQuery {
      settings {
        ...WordListConfigContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(WordListRouteContainer);

export default enhanced;
