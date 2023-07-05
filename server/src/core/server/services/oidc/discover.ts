import { URL } from "url";

import { ensureNoEndSlash } from "coral-common/utils";
import { createFetch } from "coral-server/services/fetch";

/**
 * Configuration that Coral is expecting.
 */
export interface DiscoveryConfiguration {
  issuer: string;
  authorizationURL: string;
  tokenURL?: string;
  jwksURI: string;
}

/**
 * Subset of configuration as defined in the set of Provider Metadata:
 *
 * https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
 */
interface DiscoveryRawConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint?: string;
  jwks_uri: string;
}

/**
 * fetch provides a single source for managing the fetching operations for
 * discovery.
 */
const fetch = createFetch({ name: "OIDC" });

/**
 * discover will discover the configuration for the issuer.
 *
 * @param issuer the Issuer URL that should be used to determine the
 *               configuration
 */
export async function discover(
  issuer: URL
): Promise<DiscoveryConfiguration | null> {
  // Any provider MUST provide a .well-known url that is JSON parsable based
  // on the issuer: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig
  const configurationURL =
    ensureNoEndSlash(issuer.origin + issuer.pathname) +
    "/.well-known/openid-configuration";
  const res = await fetch(configurationURL);

  // Ensure that it responds correctly.
  if (res.status !== 200) {
    return null;
  }

  try {
    // Parse the configuration
    const meta: DiscoveryRawConfiguration = await res.json();

    return {
      issuer: meta.issuer,
      authorizationURL: meta.authorization_endpoint,
      tokenURL: meta.token_endpoint,
      jwksURI: meta.jwks_uri,
    };
  } catch (err) {
    // TODO: log the error
    return null;
  }
}
