import { LanguageCode } from "coral-common/common/lib/helpers/i18n/locales";

export type CreateTenantInput = {
  domain: string;
  organization: {
    name: string;
    contactEmail: string;
    url: string;
  };
  locale: LanguageCode;
};

export type CreateSiteInput = {
  name: string;
  allowedOrigins: string[];
};
