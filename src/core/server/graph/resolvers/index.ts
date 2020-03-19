import Cursor from "coral-server/graph/scalars/cursor";
import Locale from "coral-server/graph/scalars/locale";
import Time from "coral-server/graph/scalars/time";

import { GQLResolver } from "coral-server/graph/schema/__generated__/types";

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
import { Secret } from "./Secret";
import { Settings } from "./Settings";
import { SlackConfiguration } from "./SlackConfiguration";
import { SSOAuthIntegration } from "./SSOAuthIntegration";
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
import { WebhookEndpoint } from "./WebhookEndpoint";

const Resolvers: GQLResolver = {
  ApproveCommentPayload,
  AuthIntegrations,
  BanStatus,
  BanStatusHistory,
  CloseCommenting,
  Comment,
  CommentCounts,
  CommentCreatedPayload,
  CommentEnteredModerationQueuePayload,
  CommentLeftModerationQueuePayload,
  CommentModerationAction,
  CommentReleasedPayload,
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
  Locale,
  ModerationQueue,
  ModerationQueues,
  ModeratorNote,
  Mutation,
  OIDCAuthIntegration,
  PremodStatus,
  PremodStatusHistory,
  Profile,
  Query,
  RecentCommentHistory,
  RejectCommentPayload,
  SSOAuthIntegration,
  Secret,
  Story,
  StorySettings,
  Subscription,
  SuspensionStatus,
  SuspensionStatusHistory,
  Tag,
  Time,
  User,
  UsernameHistory,
  UsernameStatus,
  UserStatus,
  Settings,
  SlackConfiguration,
  WebhookEndpoint,
};

export default Resolvers;
