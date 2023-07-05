import React from "react";
import { graphql } from "react-relay";

import { loadMarkdownEditor } from "coral-framework/components/loadables";
import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { GeneralConfigRouteQueryResponse } from "coral-admin/__generated__/GeneralConfigRouteQuery.graphql";

import GeneralConfigContainer from "./GeneralConfigContainer";

interface Props {
  data: GeneralConfigRouteQueryResponse | null;
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
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  getQuery: () => {
    // Start prefetching markdown editor.
    void loadMarkdownEditor();

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
