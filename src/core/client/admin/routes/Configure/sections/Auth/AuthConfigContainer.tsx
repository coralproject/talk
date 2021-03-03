import { Localized } from "@fluent/react/compat";
import { FORM_ERROR, FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { GQLSettings } from "coral-admin/schema";
import { DeepNullable, DeepPartial } from "coral-common/types";
import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import {
  AddSubmitHook,
  RemoveSubmitHook,
  SubmitHook,
  withForm,
  withSubmitHookContext,
} from "coral-framework/lib/form";
import { getMessage } from "coral-framework/lib/i18n";
import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { AuthConfigContainer_auth as AuthData } from "coral-admin/__generated__/AuthConfigContainer_auth.graphql";
import { AuthConfigContainer_settings as SettingsData } from "coral-admin/__generated__/AuthConfigContainer_settings.graphql";

import AccountFeaturesConfig from "./AccountFeaturesConfig";
import AuthIntegrationsConfig from "./AuthIntegrationsConfig";
import SessionConfig from "./SessionConfig";

export type FormProps = DeepNullable<
  Pick<GQLSettings, "auth" | "accountFeatures">
>;
export type OnInitValuesFct = (values: DeepPartial<FormProps>) => void;

interface Props {
  localeBundles: CoralContext["localeBundles"];
  form: FormApi;
  submitting?: boolean;
  addSubmitHook: AddSubmitHook<FormProps>;
  auth: AuthData;
  settings: SettingsData;
}

class AuthConfigContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private removeSubmitHook: RemoveSubmitHook;

  constructor(props: Props) {
    super(props);
    this.removeSubmitHook = this.props.addSubmitHook(this.submitHook);
    this.props.form.initialize(
      purgeMetadata({
        ...props.settings,
        auth: props.auth,
      })
    );
  }

  public componentWillUnmount() {
    this.removeSubmitHook();
  }

  private submitHook: SubmitHook<FormProps> = async (data, { cancel }) => {
    const integrations = [
      data.auth.integrations.google,
      data.auth.integrations.facebook,
      data.auth.integrations.sso,
      data.auth.integrations.local,
      data.auth.integrations.oidc,
    ];
    if (
      !integrations.some(
        (integration) => integration.enabled && integration.targetFilter.admin
      )
    ) {
      cancel({
        [FORM_ERROR]: (
          <Localized id="configure-auth-pleaseEnableAuthForAdmin">
            <span>
              Please enable at least one authentication integration for Coral
              Admin
            </span>
          </Localized>
        ),
      });
    } else if (
      !integrations.some(
        (integration) => integration.enabled && integration.targetFilter.stream
      )
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

  public render() {
    return (
      <HorizontalGutter size="double" data-testid="configure-authContainer">
        <AccountFeaturesConfig disabled={this.props.submitting} />
        <SessionConfig disabled={this.props.submitting} />
        <AuthIntegrationsConfig
          auth={this.props.auth}
          disabled={this.props.submitting}
        />
      </HorizontalGutter>
    );
  }
}

const enhanced = withForm(
  withFragmentContainer<Props>({
    settings: graphql`
      fragment AuthConfigContainer_settings on Settings {
        ...AccountFeaturesConfig_formValues @relay(mask: false)
      }
    `,
    auth: graphql`
      fragment AuthConfigContainer_auth on Auth {
        ...FacebookConfig_formValues @relay(mask: false)
        ...GoogleConfig_formValues @relay(mask: false)
        ...SSOConfig_formValues @relay(mask: false)
        ...LocalAuthConfig_formValues @relay(mask: false)
        ...OIDCConfig_formValues @relay(mask: false)
        ...SessionConfig_formValues @relay(mask: false)

        ...FacebookConfigContainer_auth
        ...GoogleConfigContainer_auth
        ...SSOConfigContainer_auth
        ...OIDCConfigContainer_auth
      }
    `,
  })(
    withSubmitHookContext((addSubmitHook) => ({ addSubmitHook }))(
      withContext(({ localeBundles }) => ({ localeBundles }))(
        AuthConfigContainer
      )
    )
  )
);

export default enhanced;
