import { graphql } from "react-relay";

import { NoFragmentRefs } from "coral-framework/testHelpers";

import { authControl_settings } from "coral-stream/__generated__/authControl_settings.graphql";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment authControl_settings on Settings {
    auth {
      integrations {
        local {
          enabled
          allowRegistration
          targetFilter {
            stream
          }
        }
        oidc {
          enabled
          allowRegistration
          targetFilter {
            stream
          }
        }
        google {
          enabled
          allowRegistration
          targetFilter {
            stream
          }
        }
        facebook {
          enabled
          allowRegistration
          targetFilter {
            stream
          }
        }
      }
    }
  }
`;

export function weControlAuth(data: NoFragmentRefs<authControl_settings>) {
  const integrations = data.auth.integrations;
  return [
    integrations.facebook,
    integrations.google,
    integrations.local,
    integrations.oidc,
  ].some((i) => i.enabled && i.targetFilter.stream);
}

export function supportsRegister(data: NoFragmentRefs<authControl_settings>) {
  const integrations = data.auth.integrations;
  return [
    integrations.facebook,
    integrations.google,
    integrations.local,
    integrations.oidc,
  ].some((i) => i.allowRegistration && i.enabled && i.targetFilter.stream);
}
