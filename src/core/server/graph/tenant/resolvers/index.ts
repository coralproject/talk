import Cursor from "talk-server/graph/common/scalars/cursor";
import Time from "talk-server/graph/common/scalars/time";
import { GQLResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { AcceptCommentPayload } from "./AcceptCommentPayload";
import { AuthIntegrations } from "./AuthIntegrations";
import { BannedStatusHistory } from "./BannedStatusHistory";
import { CloseCommenting } from "./CloseCommenting";
import { Comment } from "./Comment";
import { CommentCounts } from "./CommentCounts";
import { CommentModerationAction } from "./CommentModerationAction";
import { CommentRevision } from "./CommentRevision";
import { DisableCommenting } from "./DisableCommenting";
import { FacebookAuthIntegration } from "./FacebookAuthIntegration";
import { GoogleAuthIntegration } from "./GoogleAuthIntegration";
import { ModerationQueue } from "./ModerationQueue";
import { ModerationQueues } from "./ModerationQueues";
import { Mutation } from "./Mutation";
import { OIDCAuthIntegration } from "./OIDCAuthIntegration";
import { Profile } from "./Profile";
import { Query } from "./Query";
import { RejectCommentPayload } from "./RejectCommentPayload";
import { Story } from "./Story";
import { StorySettings } from "./StorySettings";
import { SuspensionStatusHistory } from "./SuspensionStatusHistory";
import { Tag } from "./Tag";
import { User } from "./User";

const Resolvers: GQLResolver = {
  AcceptCommentPayload,
  AuthIntegrations,
  BannedStatusHistory,
  CloseCommenting,
  Comment,
  CommentCounts,
  CommentModerationAction,
  CommentRevision,
  Cursor,
  DisableCommenting,
  FacebookAuthIntegration,
  GoogleAuthIntegration,
  ModerationQueue,
  ModerationQueues,
  Mutation,
  OIDCAuthIntegration,
  Profile,
  Query,
  RejectCommentPayload,
  Story,
  StorySettings,
  Tag,
  SuspensionStatusHistory,
  Time,
  User,
};

export default Resolvers;
