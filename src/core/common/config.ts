/**
 * SentryReporterConfig is the ReporterConfig for the Sentry service.
 */
export interface SentryReporterConfig {
  name: "sentry";

  /**
   * dsn is the string representing this particular integration.
   */
  dsn: string;
}

export type ReporterConfig = SentryReporterConfig;

/**
 * StaticConfig is the configuration provided to the client javascript via a
 * JSON blob on the HTML of the embedding page.
 */
export interface StaticConfig {
  /**
   * staticURI is prepended to the static url's that are included on the static
   * pages.
   */
  staticURI: string;

  /**
   * tenantDomain is the domain of the currently requested tenant.
   */
  tenantDomain?: string;

  /**
   * reporter stores the reporter configuration for the current reporter
   * available.
   */
  reporter?: ReporterConfig;

  /**
   * graphQLSubscriptionURI is the endpoint that should be used when trying to
   * execute subscription GraphQL requests. If an empty string, the default
   * should be used that's based on the iFrame location.
   */
  graphQLSubscriptionURI: string;

  /**
   * featureFlags are all the feature flags currently enabled on the tenant.
   */
  featureFlags: string[];

  /**
   * forceAdminLocalAuth is whether local authentication is always available
   * for this Coral deployment. This is useful for ensuring that Coral service
   * teams can access the admin with their Coral local authentication.
   */
  forceAdminLocalAuth: boolean;
}
