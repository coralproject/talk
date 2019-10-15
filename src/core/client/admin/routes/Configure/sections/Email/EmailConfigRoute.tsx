import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components";

import { EmailConfigRouteQueryResponse } from "coral-admin/__generated__/EmailConfigRouteQuery.graphql";

import EmailConfigContainer from "./EmailConfigContainer";

interface Props {
  data: EmailConfigRouteQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

class EmailConfigRoute extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <EmailConfigContainer
        email={this.props.data.settings.email}
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query EmailConfigRouteQuery {
      settings {
        email {
          ...EmailConfigContainer_email
        }
      }
    }
  `,
  cacheConfig: { force: true },
})(EmailConfigRoute);

export default enhanced;
