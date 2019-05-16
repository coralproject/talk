import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { GeneralConfigRouteContainerQueryResponse } from "coral-admin/__generated__/GeneralConfigRouteContainerQuery.graphql";
import { loadMarkdownEditor } from "coral-framework/components/loadables";
import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components";

import GeneralConfigContainer from "./GeneralConfigContainer";

interface Props {
  data: GeneralConfigRouteContainerQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

class GeneralConfigRouteContainer extends React.Component<Props> {
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
      query GeneralConfigRouteContainerQuery {
        settings {
          ...GeneralConfigContainer_settings
        }
      }
    `;
  },
  cacheConfig: { force: true },
})(GeneralConfigRouteContainer);

export default enhanced;
