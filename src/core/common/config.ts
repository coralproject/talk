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
   * reporter stores the reporter configuration for the current reporter
   * available.
   */
  reporter?: ReporterConfig;

  /**
   * featureFlags are all the feature flags currently enabled on the tenant.
   */
  featureFlags: string[];
}
