import Cursor from "talk-server/graph/common/scalars/cursor";
import { GQLResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import AuthIntegrations from "./auth_integrations";
import Comment from "./comment";
import CommentCounts from "./comment_counts";
import Mutation from "./mutation";
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
  Profile,
  Query,
  Story,
  User,
};

export default Resolvers;
