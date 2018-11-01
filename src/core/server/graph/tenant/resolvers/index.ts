import Cursor from "talk-server/graph/common/scalars/cursor";
import Time from "talk-server/graph/common/scalars/time";

import { GQLResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import AuthIntegrations from "./auth_integrations";
import Comment from "./comment";
import CommentCounts from "./comment_counts";
import Mutation from "./mutation";
import OIDCAuthIntegration from "./oidc_auth_integration";
import Profile from "./profile";
import Query from "./query";
import Story from "./story";
import User from "./user";

const Resolvers: GQLResolver = {
  AuthIntegrations,
  Comment,
  CommentCounts,
  Cursor,
  Mutation,
  OIDCAuthIntegration,
  Profile,
  Query,
  Time,
  Story,
  User,
};

export default Resolvers;
