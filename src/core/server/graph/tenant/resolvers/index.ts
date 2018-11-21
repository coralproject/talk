import Cursor from "talk-server/graph/common/scalars/cursor";
import Time from "talk-server/graph/common/scalars/time";

import { GQLResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { AuthIntegrations } from "./AuthIntegrations";
import { Comment } from "./Comment";
import { CommentCounts } from "./CommentCounts";
import { CommentModerationAction } from "./CommentModerationAction";
import { CommentRevision } from "./CommentRevision";
import { FacebookAuthIntegration } from "./FacebookAuthIntegration";
import { GoogleAuthIntegration } from "./GoogleAuthIntegration";
import { Mutation } from "./Mutation";
import { OIDCAuthIntegration } from "./OIDCAuthIntegration";
import { Profile } from "./Profile";
import { Query } from "./Query";
import { Story } from "./Story";
import { User } from "./User";

const Resolvers: GQLResolver = {
  AuthIntegrations,
  Comment,
  CommentCounts,
  CommentModerationAction,
  CommentRevision,
  Cursor,
  Mutation,
  OIDCAuthIntegration,
  FacebookAuthIntegration,
  GoogleAuthIntegration,
  Profile,
  Query,
  Time,
  Story,
  User,
};

export default Resolvers;
