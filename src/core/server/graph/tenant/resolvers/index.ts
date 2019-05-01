import Cursor from "talk-server/graph/common/scalars/cursor";
import Time from "talk-server/graph/common/scalars/time";
import { GQLResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { AcceptCommentPayload } from "./AcceptCommentPayload";
import { ActionCounts } from "./ActionCounts";
import { AuthIntegrations } from "./AuthIntegrations";
import { BanStatus } from "./BanStatus";
import { BanStatusHistory } from "./BanStatusHistory";
import { CloseCommenting } from "./CloseCommenting";
import { Comment } from "./Comment";
import { CommentCounts } from "./CommentCounts";
import { CommentModerationAction } from "./CommentModerationAction";
import { CommentRevision } from "./CommentRevision";
import { DisableCommenting } from "./DisableCommenting";
import { FacebookAuthIntegration } from "./FacebookAuthIntegration";
import { Flag } from "./Flag";
import { FlagActionCounts } from "./FlagActionCounts";
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
import { SuspensionStatus } from "./SuspensionStatus";
import { SuspensionStatusHistory } from "./SuspensionStatusHistory";
import { Tag } from "./Tag";
import { User } from "./User";
import { UserStatus } from "./UserStatus";

const Resolvers: GQLResolver = {
  AcceptCommentPayload,
  ActionCounts,
  AuthIntegrations,
  BanStatus,
  BanStatusHistory,
  CloseCommenting,
  Comment,
  CommentCounts,
  CommentModerationAction,
  CommentRevision,
  Cursor,
  DisableCommenting,
  FacebookAuthIntegration,
  Flag,
  FlagActionCounts,
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
  SuspensionStatus,
  SuspensionStatusHistory,
  Tag,
  Time,
  User,
  UserStatus,
};

export default Resolvers;
