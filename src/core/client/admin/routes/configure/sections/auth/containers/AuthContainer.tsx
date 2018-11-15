import { FormApi } from "final-form";
import { RouteProps } from "found";
import { merge } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { AuthContainerQueryResponse } from "talk-admin/__generated__/AuthContainerQuery.graphql";
import { Spinner } from "talk-ui/components";

import Auth from "../components/Auth";

interface Props extends AuthContainerQueryResponse {
  form: FormApi;
  submitting?: boolean;
}

export default class AuthContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private initialValues = {};

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {
    this.props.form.initialize({ auth: this.initialValues });
  }

  private handleOnInitValues = (values: any) => {
    this.initialValues = merge(this.initialValues, values);
  };

  public render() {
    return (
      <Auth
        disabled={this.props.submitting}
        auth={this.props.settings.auth}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

AuthContainer.routeConfig = {
  Component: AuthContainer,
  query: graphql`
    query AuthContainerQuery {
      settings {
        auth {
          ...FacebookConfigContainer_auth
          ...FacebookConfigContainer_authReadOnly
          ...GoogleConfigContainer_auth
          ...GoogleConfigContainer_authReadOnly
          ...SSOConfigContainer_auth
          ...SSOConfigContainer_authReadOnly
          ...LocalAuthConfigContainer_auth
          ...DisplayNamesConfigContainer_auth
          ...OIDCConfigListContainer_auth
          ...OIDCConfigListContainer_authReadOnly
        }
      }
    }
  `,
  cacheConfig: { force: true },
  render: ({ Component, props }) =>
    props && Component ? <Component {...props} /> : <Spinner />,
};
