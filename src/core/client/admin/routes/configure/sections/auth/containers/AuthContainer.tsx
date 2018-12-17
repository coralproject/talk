import { FORM_ERROR, FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import { RouteProps } from "found";
import { get, merge } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { AuthContainerQueryResponse } from "talk-admin/__generated__/AuthContainerQuery.graphql";
import { TalkContext, withContext } from "talk-framework/lib/bootstrap";
import { getMessage } from "talk-framework/lib/i18n";
import { Delay, Spinner } from "talk-ui/components";

import {
  AddSubmitHook,
  RemoveSubmitHook,
  SubmitHook,
  withSubmitHookContext,
} from "../../../submitHook";
import Auth from "../components/Auth";

interface Props extends AuthContainerQueryResponse {
  localeBundles: TalkContext["localeBundles"];
  form: FormApi;
  submitting?: boolean;
  addSubmitHook: AddSubmitHook;
}

export default class AuthContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private initialValues = {};
  private removeSubmitHook: RemoveSubmitHook;

  constructor(props: Props) {
    super(props);
    this.removeSubmitHook = this.props.addSubmitHook(this.submitHook);
  }

  public componentDidMount() {
    this.props.form.initialize({ auth: this.initialValues });
  }

  public componentWillUnmount() {
    this.removeSubmitHook();
  }

  private submitHook: SubmitHook = async (data, { cancel }) => {
    const integrations = [
      get(data, "auth.integrations.google"),
      get(data, "auth.integrations.facebook"),
      get(data, "auth.integrations.sso"),
      get(data, "auth.integrations.local"),
      ...(get(data, "auth.integrations.oidc") || []),
    ];
    if (!integrations.some((i: any) => i.enabled && i.targetFilter.admin)) {
      cancel({
        [FORM_ERROR]: (
          <Localized id="configure-auth-pleaseEnableAuthForAdmin">
            <span>
              Please enable at least one authentication integration for Talk
              Admin
            </span>
          </Localized>
        ),
      });
    } else if (
      !integrations.some((i: any) => i.enabled && i.targetFilter.stream)
    ) {
      const confirmMessage = getMessage(
        this.props.localeBundles,
        "configure-auth-confirmNoAuthForCommentStream",
        "No authentication integration has been enabled for the Comment Stream. Do you really want to continue?"
      );

      if (!window.confirm(confirmMessage)) {
        cancel();
      }
    }
    return;
  };

  private handleOnInitValues = (values: any) => {
    this.initialValues = merge({}, this.initialValues, values);
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

const enhanced = withSubmitHookContext(addSubmitHook => ({ addSubmitHook }))(
  withContext(({ localeBundles }) => ({ localeBundles }))(AuthContainer)
);

AuthContainer.routeConfig = {
  Component: enhanced,
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
    props && Component ? (
      <Component {...props} />
    ) : (
      <Delay>
        <Spinner />
      </Delay>
    ),
};
