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
  fragment BskyConfig_formValues on Auth {
    integrations {
      bsky {
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

const BskyLink = () => (
  <TextLink target="_blank">
    {"https://docs.bsky.app/docs/advanced-guides/oauth-client"}
  </TextLink>
);

const isEnabled: Condition = (value, values) =>
  Boolean(values.auth.integrations.bsky.enabled);

const BskyConfig: FunctionComponent<Props> = ({
  disabled,
  callbackURL,
}) => (
  <ConfigBoxWithToggleField
    data-testid="configure-auth-bsky-container"
    title={
      <Localized id="configure-auth-bsky-loginWith">
        <Header container="h2">Login with Bluesky</Header>
      </Localized>
    }
    name="auth.integrations.bsky.enabled"
    disabled={disabled}
  >
    {(disabledInside) => (
      <>
        <Localized
          id="configure-auth-bsky-toEnableIntegration"
          elems={{ Link: <BskyLink />, br: <br /> }}
        >
          <FormFieldDescription>
            To enable the integration with Bluesky, you need to
            set a client ID and secret.
          </FormFieldDescription>
        </Localized>
        <RedirectField url={callbackURL} />
        <HorizontalRule />
        <ClientIDField
          name="auth.integrations.bsky.clientID"
          validate={validateWhen(isEnabled, required)}
          disabled={disabledInside}
        />
        <ClientSecretField
          name="auth.integrations.bsky.clientSecret"
          validate={validateWhen(isEnabled, required)}
          disabled={disabledInside}
        />
        <TargetFilterField
          label={
            <Localized id="configure-auth-bsky-useLoginOn">
              <span>Use Bluesky login on</span>
            </Localized>
          }
          name="auth.integrations.bsky.targetFilter"
          disabled={disabledInside}
        />
        <RegistrationField
          name="auth.integrations.bsky.allowRegistration"
          disabled={disabledInside}
        />
      </>
    )}
  </ConfigBoxWithToggleField>
);

export default BskyConfig;
