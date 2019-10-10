import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { loadMarkdownEditor } from "coral-framework/components/loadables";
import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components";

import { GeneralConfigRouteQueryResponse } from "coral-admin/__generated__/GeneralConfigRouteQuery.graphql";

import GeneralConfigContainer from "./GeneralConfigContainer";

interface Props {
  data: GeneralConfigRouteQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

class GeneralConfigRoute extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <GeneralConfigContainer
        settings={this.props.data.settings}
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  getQuery: () => {
    // Start prefetching markdown editor.
    loadMarkdownEditor();

    // Fetch graphql data.
    return graphql`
      query GeneralConfigRouteQuery {
        settings {
          ...GeneralConfigContainer_settings
        }
      }
    `;
  },
  cacheConfig: { force: true },
})(GeneralConfigRoute);

export default enhanced;
