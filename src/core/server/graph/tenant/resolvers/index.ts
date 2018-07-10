import Cursor from "talk-server/graph/common/scalars/cursor";
import { GQLResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import Asset from "./asset";
import AuthIntegrations from "./auth_integrations";
import AuthSettings from "./auth_settings";
import Comment from "./comment";
import FacebookAuthIntegration from "./facebook_auth_integration";
import GoogleAuthIntegration from "./google_auth_integration";
import LocalAuthIntegration from "./local_auth_integration";
import Mutation from "./mutation";
import OIDCAuthIntegration from "./oidc_auth_integration";
import Profile from "./profile";
import Query from "./query";
import SSOAuthIntegration from "./sso_auth_integration";

const Resolvers: GQLResolver = {
  Asset,
  AuthIntegrations,
  AuthSettings,
  Comment,
  FacebookAuthIntegration,
  GoogleAuthIntegration,
  LocalAuthIntegration,
  OIDCAuthIntegration,
  SSOAuthIntegration,
  Cursor,
  Mutation,
  Profile,
  Query,
};

export default Resolvers;
