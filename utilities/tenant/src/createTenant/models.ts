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

export enum GQLUSER_ROLE {
  COMMENTER = 'COMMENTER',
  MEMBER = 'MEMBER',
  STAFF = 'STAFF',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export interface LocalProfile {
  type: "local";
  id: string;
  password: string;
  passwordID: string;
  resetID?: string;
}

export type CreateUserInput = {
  id?: string;
  username?: string;
  avatar?: string;
  email?: string;
  badges?: string[];
  ssoURL?: string;
  emailVerified?: boolean;
  duplicateEmail?: string;
  role: GQLUSER_ROLE;
  profile: LocalProfile;
};
