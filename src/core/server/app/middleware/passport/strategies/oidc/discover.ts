import fetch from "node-fetch";
import { URL } from "url";

/**
 * Configuration that Talk is expecting.
 */
export interface DiscoveryConfiguration {
  authorizationURL?: string;
  tokenURL?: string;
  jwksURI?: string;
}

/**
 * Subset of configuration as defined in the set of Provider Metadata:
 *
 * https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
 */
interface DiscoveryRawConfiguration {
  authorization_endpoint?: string;
  token_endpoint?: string;
  jwks_uri?: string;
}

/**
 * discover will discover the configuration for the issuer.
 *
 * @param issuer the Issuer URL that should be used to determine the
 *               configuration
 */
export async function discover(issuer: URL): Promise<DiscoveryConfiguration> {
  // Any provider MUST provide a .well-known url that is JSON parsable based
  // on the issuer: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig
  const configurationURL =
    issuer.origin +
    issuer.pathname.replace(/\/$/, "") +
    "/.well-known/openid-configuration";
  const res = await fetch(configurationURL);

  // Parse the configuration
  const meta: DiscoveryRawConfiguration = await res.json();

  return {
    authorizationURL: meta.authorization_endpoint,
    tokenURL: meta.token_endpoint,
    jwksURI: meta.jwks_uri,
  };
}
