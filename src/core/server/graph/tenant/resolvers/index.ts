import Cursor from "coral-server/graph/common/scalars/cursor";
import Locale from "coral-server/graph/common/scalars/locale";
import Time from "coral-server/graph/common/scalars/time";
import { GQLResolver } from "coral-server/graph/tenant/schema/__generated__/types";

import { ApproveCommentPayload } from "./ApproveCommentPayload";
import { AuthIntegrations } from "./AuthIntegrations";
import { BanStatus } from "./BanStatus";
import { BanStatusHistory } from "./BanStatusHistory";
import { CloseCommenting } from "./CloseCommenting";
import { Comment } from "./Comment";
import { CommentCounts } from "./CommentCounts";
import { CommentCreatedPayload } from "./CommentCreatedPayload";
import { CommentEnteredModerationQueuePayload } from "./CommentEnteredModerationQueuePayload";
import { CommentLeftModerationQueuePayload } from "./CommentLeftModerationQueuePayload";
import { CommentModerationAction } from "./CommentModerationAction";
import { CommentReleasedPayload } from "./CommentReleasedPayload";
import { CommentReplyCreatedPayload } from "./CommentReplyCreatedPayload";
import { CommentRevision } from "./CommentRevision";
import { CommentStatusUpdatedPayload } from "./CommentStatusUpdatedPayload";
import { DisableCommenting } from "./DisableCommenting";
import { FacebookAuthIntegration } from "./FacebookAuthIntegration";
import { FeatureCommentPayload } from "./FeatureCommentPayload";
import { Flag } from "./Flag";
import { GoogleAuthIntegration } from "./GoogleAuthIntegration";
import { Invite } from "./Invite";
import { LiveConfiguration } from "./LiveConfiguration";
import { ModerationQueue } from "./ModerationQueue";
import { ModerationQueues } from "./ModerationQueues";
import { ModeratorNote } from "./ModeratorNote";
import { Mutation } from "./Mutation";
import { OIDCAuthIntegration } from "./OIDCAuthIntegration";
import { PremodStatus } from "./PremodStatus";
import { PremodStatusHistory } from "./PremodStatusHistory";
import { Profile } from "./Profile";
import { Query } from "./Query";
import { RecentCommentHistory } from "./RecentCommentHistory";
import { RejectCommentPayload } from "./RejectCommentPayload";
import { Story } from "./Story";
import { StorySettings } from "./StorySettings";
import { Subscription } from "./Subscription";
import { SuspensionStatus } from "./SuspensionStatus";
import { SuspensionStatusHistory } from "./SuspensionStatusHistory";
import { Tag } from "./Tag";
import { User } from "./User";
import { UsernameHistory } from "./UsernameHistory";
import { UsernameStatus } from "./UsernameStatus";
import { UserStatus } from "./UserStatus";

const Resolvers: GQLResolver = {
  ApproveCommentPayload,
  AuthIntegrations,
  BanStatus,
  BanStatusHistory,
  CloseCommenting,
  Comment,
  CommentCounts,
  CommentCreatedPayload,
  CommentReleasedPayload,
  CommentEnteredModerationQueuePayload,
  CommentLeftModerationQueuePayload,
  CommentModerationAction,
  CommentReplyCreatedPayload,
  CommentRevision,
  CommentStatusUpdatedPayload,
  Cursor,
  DisableCommenting,
  FacebookAuthIntegration,
  FeatureCommentPayload,
  Flag,
  GoogleAuthIntegration,
  Invite,
  LiveConfiguration,
  ModerationQueue,
  ModerationQueues,
  Mutation,
  OIDCAuthIntegration,
  PremodStatus,
  PremodStatusHistory,
  Profile,
  Query,
  RecentCommentHistory,
  RejectCommentPayload,
  Story,
  StorySettings,
  Subscription,
  SuspensionStatus,
  SuspensionStatusHistory,
  UsernameHistory,
  Tag,
  Time,
  Locale,
  User,
  UserStatus,
  UsernameStatus,
  ModeratorNote,
};

export default Resolvers;
