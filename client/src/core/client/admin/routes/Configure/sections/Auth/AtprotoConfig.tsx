import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import { FormFieldDescription, TextLink } from "coral-ui/components/v2";

import Header from "../../Header";
import HorizontalRule from "../../HorizontalRule";
import ClientIDField from "./ClientIDField";
import ClientSecretField from "./ClientSecretField";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RedirectField from "./RedirectField";
import RegistrationField from "./RegistrationField";
import TargetFilterField from "./TargetFilterField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment AtprotoConfig_formValues on Auth {
    integrations {
      atproto {
        enabled
        allowRegistration
        targetFilter {
          admin
          stream
        }
        clientID
        clientSecret
      }
    }
  }
`;

interface Props {
  disabled?: boolean;
  callbackURL: string;
}

const AtprotoLink = () => (
  <TextLink target="_blank">
    {"https://docs.bsky.app/docs/advanced-guides/oauth-client"}
  </TextLink>
);

const isEnabled: Condition = (value, values) =>
  Boolean(values.auth.integrations.atproto.enabled);

const AtprotoConfig: FunctionComponent<Props> = ({ disabled, callbackURL }) => (
  <ConfigBoxWithToggleField
    data-testid="configure-auth-atproto-container"
    title={
      <Localized id="configure-auth-atproto-loginWith">
        <Header container="h2">Login with ATproto or Bluesky</Header>
      </Localized>
    }
    name="auth.integrations.atproto.enabled"
    disabled={disabled}
  >
    {(disabledInside) => (
      <>
        <Localized
          id="configure-auth-atproto-toEnableIntegration"
          elems={{ Link: <AtprotoLink />, br: <br /> }}
        >
          <FormFieldDescription>
            Client ID is the name that will identify this ATproto oauth client
            to users. For more information visit:
            <br />
            {<AtprotoLink />}
          </FormFieldDescription>
        </Localized>
        <RedirectField url={callbackURL} />
        <HorizontalRule />
        <ClientIDField
          name="auth.integrations.atproto.clientID"
          validate={validateWhen(isEnabled, required)}
          disabled={disabledInside}
        />
        <ClientSecretField
          name="auth.integrations.atproto.clientSecret"
          validate={validateWhen(isEnabled, required)}
          disabled={disabledInside}
        />
        <TargetFilterField
          label={
            <Localized id="configure-auth-atproto-useLoginOn">
              <span>Use Atproto login on</span>
            </Localized>
          }
          name="auth.integrations.atproto.targetFilter"
          disabled={disabledInside}
        />
        <RegistrationField
          name="auth.integrations.atproto.allowRegistration"
          disabled={disabledInside}
        />
      </>
    )}
  </ConfigBoxWithToggleField>
);

export default AtprotoConfig;
