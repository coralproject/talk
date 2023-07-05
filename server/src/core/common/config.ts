import { LanguageCode } from "./helpers";

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
   * flattenReplies is whether or not flattenReplies is enabled on the tenant.
   */
  flattenReplies: boolean;

  /**
   * forceAdminLocalAuth is whether local authentication is always available
   * for this Coral deployment. This is useful for ensuring that Coral service
   * teams can access the admin with their Coral local authentication.
   */
  forceAdminLocalAuth: boolean;

  /**
   * archivingEnabled will be true when the deployment has set a valid MongoDB
   * URI for MONGODB_ARCHIVE_URI.
   */
  archivingEnabled: boolean;

  /**
   * autoArchiveOlderThanMs is the time in milliseconds that a story will
   * be kept before being auto-archived.
   */
  autoArchiveOlderThanMs: number;
}

export interface EmbedBootstrapConfig {
  locale: LanguageCode;
  assets: {
    js: {
      src: string;
    }[];
    css: {
      src: string;
    }[];
  };
  customFontsCSSURL: string | undefined;
  customCSSURL: string | undefined;
  defaultFontsCSSURL: string | undefined;
  disableDefaultFonts: boolean;
  staticConfig: StaticConfig;
}
