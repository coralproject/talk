import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import { DeepNullable, DeepPartial } from "coral-common/common/lib/types";
import {
  AddSubmitHook,
  SubmitHook,
  withSubmitHookContext,
} from "coral-framework/lib/form";
import { useGetMessage } from "coral-framework/lib/i18n";
import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSettings } from "coral-framework/schema";
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
  submitting?: boolean;
  addSubmitHook: AddSubmitHook<FormProps>;
  auth: AuthData;
  settings: SettingsData;
}

const AuthConfigContainer: FunctionComponent<Props> = ({
  submitting,
  addSubmitHook,
  auth,
  settings,
}) => {
  const form = useForm();
  const getMessage = useGetMessage();

  const submitHook: SubmitHook<FormProps> = async (data, { cancel }) => {
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
        "configure-auth-confirmNoAuthForCommentStream",
        "No authentication integration has been enabled for the Comment Stream. Do you really want to continue?"
      );

      // eslint-disable-next-line no-restricted-globals
      if (!window.confirm(confirmMessage)) {
        cancel();
      }
    }
    return;
  };

  useMemo(
    () =>
      form.initialize(
        purgeMetadata({
          ...settings,
          auth,
        })
      ),
    [auth, form, settings]
  );

  useEffect(() => {
    const removeSubmitHook = addSubmitHook(submitHook);
    return () => {
      removeSubmitHook();
    };
  }, [addSubmitHook, submitHook]);

  return (
    <HorizontalGutter size="double" data-testid="configure-authContainer">
      <AccountFeaturesConfig disabled={submitting} />
      <SessionConfig disabled={submitting} />
      <AuthIntegrationsConfig auth={auth} disabled={submitting} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
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
      ...LocalAuthConfigContainer_formValues @relay(mask: false)
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
    AuthConfigContainer
  )
);

export default enhanced;
