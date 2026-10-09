import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { validateURL } from "coral-framework/lib/validation";
import { FormFieldDescription, Label, TextLink } from "coral-ui/components/v2";

import Header from "../../Header";
import HorizontalRule from "../../HorizontalRule";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import LabeledTextField from "./LabeledTextField";
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
        clientName
        logoURI
      }
    }
  }
`;

interface Props {
  disabled?: boolean;
  callbackURL: string;
  clientMetadataURL: string;
}

const AtprotoLink = () => (
  <TextLink target="_blank">
    {"https://docs.bsky.app/docs/advanced-guides/oauth-client"}
  </TextLink>
);

const AtprotoConfig: FunctionComponent<Props> = ({
  disabled,
  callbackURL,
  clientMetadataURL,
}) => (
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
            Users sign in with their ATproto or Bluesky handle. No client ID or
            secret is needed, this site identifies itself with a client metadata
            document. For more information visit:
            <br />
            {<AtprotoLink />}
          </FormFieldDescription>
        </Localized>
        <RedirectField url={callbackURL} />
        <RedirectField
          url={clientMetadataURL}
          label={
            <Localized id="configure-auth-atproto-clientMetadataURL">
              <Label>Client ID (client metadata URL)</Label>
            </Localized>
          }
          description={
            <Localized id="configure-auth-atproto-clientMetadataURLDescription">
              <FormFieldDescription>
                Authorization servers identify this site by this URL. It must be
                publicly reachable over HTTPS. Local development uses a loopback
                client instead.
              </FormFieldDescription>
            </Localized>
          }
        />
        <HorizontalRule />
        <LabeledTextField
          name="auth.integrations.atproto.clientName"
          disabled={disabledInside}
          label={
            <Localized id="configure-auth-atproto-clientName">
              <span>Client name</span>
            </Localized>
          }
          description={
            <Localized id="configure-auth-atproto-clientNameDescription">
              <FormFieldDescription>
                Shown to users when they approve signing in. Uses your
                organization name when left empty.
              </FormFieldDescription>
            </Localized>
          }
        />
        <LabeledTextField
          name="auth.integrations.atproto.logoURI"
          validate={validateURL}
          disabled={disabledInside}
          label={
            <Localized id="configure-auth-atproto-logoURI">
              <span>Logo URL</span>
            </Localized>
          }
          description={
            <Localized id="configure-auth-atproto-logoURIDescription">
              <FormFieldDescription>
                Optional. An image shown to users when they approve signing in.
              </FormFieldDescription>
            </Localized>
          }
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
