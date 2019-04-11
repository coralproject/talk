import { FORM_ERROR, FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import { RouteProps } from "found";
import { get } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { AuthConfigContainer_auth as AuthData } from "talk-admin/__generated__/AuthConfigContainer_auth.graphql";
import { pureMerge } from "talk-common/utils";
import { TalkContext, withContext } from "talk-framework/lib/bootstrap";
import {
  AddSubmitHook,
  RemoveSubmitHook,
  SubmitHook,
  withSubmitHookContext,
} from "talk-framework/lib/form";
import { getMessage } from "talk-framework/lib/i18n";
import { withFragmentContainer } from "talk-framework/lib/relay";

import AuthConfig from "../components/AuthConfig";

interface Props {
  localeBundles: TalkContext["localeBundles"];
  form: FormApi;
  submitting?: boolean;
  addSubmitHook: AddSubmitHook;
  auth: AuthData;
}

class AuthConfigContainer extends React.Component<Props> {
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
      get(data, "auth.integrations.oidc"),
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
    this.initialValues = pureMerge(this.initialValues, values);
  };

  public render() {
    return (
      <AuthConfig
        disabled={this.props.submitting}
        auth={this.props.auth}
        onInitValues={this.handleOnInitValues}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment AuthConfigContainer_auth on Auth {
      ...FacebookConfigContainer_auth
      ...FacebookConfigContainer_authReadOnly
      ...GoogleConfigContainer_auth
      ...GoogleConfigContainer_authReadOnly
      ...SSOConfigContainer_auth
      ...SSOConfigContainer_authReadOnly
      ...LocalAuthConfigContainer_auth
      ...OIDCConfigContainer_auth
      ...OIDCConfigContainer_authReadOnly
    }
  `,
})(
  withSubmitHookContext(addSubmitHook => ({ addSubmitHook }))(
    withContext(({ localeBundles }) => ({ localeBundles }))(AuthConfigContainer)
  )
);

export default enhanced;
