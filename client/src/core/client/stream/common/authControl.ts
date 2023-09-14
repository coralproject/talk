/**
 * This file contains methods that helps determine which
 * parts of auth we control depending on the current settings.
 * It comes with a fragment that retrieves the data needed
 * to call the methods and can be used in queries.
 */

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

/**
 * Determine whether we control the auth and if we provide a way
 * to open the auth view.
 */
export function weControlAuth(data: NoFragmentRefs<authControl_settings>) {
  const integrations = data.auth.integrations;
  return [
    integrations.facebook,
    integrations.google,
    integrations.local,
    integrations.oidc,
  ].some((i) => i.enabled && i.targetFilter.stream);
}

/**
 * Determine whether we support register and if we provide a way
 * to open the register view.
 */
export function supportsRegister(data: NoFragmentRefs<authControl_settings>) {
  const integrations = data.auth.integrations;
  return [
    integrations.facebook,
    integrations.google,
    integrations.local,
    integrations.oidc,
  ].some((i) => i.allowRegistration && i.enabled && i.targetFilter.stream);
}
