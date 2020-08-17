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
import { CommentMedia } from "./CommentMedia";
import { CommentModerationAction } from "./CommentModerationAction";
import { CommentReleasedPayload } from "./CommentReleasedPayload";
import { CommentReplyCreatedPayload } from "./CommentReplyCreatedPayload";
import { CommentRevision } from "./CommentRevision";
import { CommentStatusUpdatedPayload } from "./CommentStatusUpdatedPayload";
import { DisableCommenting } from "./DisableCommenting";
import { ExternalModerationPhase } from "./ExternalModerationPhase";
import { FacebookAuthIntegration } from "./FacebookAuthIntegration";
import { FeatureCommentPayload } from "./FeatureCommentPayload";
import { Flag } from "./Flag";
import { GiphyMediaConfiguration } from "./GiphyMediaConfiguration";
import { GoogleAuthIntegration } from "./GoogleAuthIntegration";
import { Invite } from "./Invite";
import { LiveConfiguration } from "./LiveConfiguration";
import { MediaConfiguration } from "./MediaConfiguration";
import { ModerationQueue } from "./ModerationQueue";
import { ModerationQueues } from "./ModerationQueues";
import { ModeratorNote } from "./ModeratorNote";
import { Mutation } from "./Mutation";
import { OIDCAuthIntegration } from "./OIDCAuthIntegration";
import { PremodStatus } from "./PremodStatus";
import { PremodStatusHistory } from "./PremodStatusHistory";
import { Profile } from "./Profile";
import { Query } from "./Query";
import { Queue } from "./Queue";
import { Queues } from "./Queues";
import { RecentCommentHistory } from "./RecentCommentHistory";
import { RejectCommentPayload } from "./RejectCommentPayload";
import { Settings } from "./Settings";
import { SigningSecret } from "./SigningSecret";
import { Site } from "./Site";
import { SlackConfiguration } from "./SlackConfiguration";
import { SSOAuthIntegration } from "./SSOAuthIntegration";
import { Story } from "./Story";
import { StorySettings } from "./StorySettings";
import { Subscription } from "./Subscription";
import { SuspensionStatus } from "./SuspensionStatus";
import { SuspensionStatusHistory } from "./SuspensionStatusHistory";
import { Tag } from "./Tag";
import { TwitterMediaConfiguration } from "./TwitterMediaConfiguration";
import { User } from "./User";
import { UserModerationScopes } from "./UserModerationScopes";
import { UsernameHistory } from "./UsernameHistory";
import { UsernameStatus } from "./UsernameStatus";
import { UserStatus } from "./UserStatus";
import { WarningStatus } from "./WarningStatus";
import { WarningStatusHistory } from "./WarningStatusHistory";
import { WebhookEndpoint } from "./WebhookEndpoint";
import { YouTubeMediaConfiguration } from "./YouTubeMediaConfiguration";

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
  CommentMedia,
  CommentModerationAction,
  CommentReleasedPayload,
  CommentReplyCreatedPayload,
  CommentRevision,
  CommentStatusUpdatedPayload,
  Cursor,
  DisableCommenting,
  ExternalModerationPhase,
  FacebookAuthIntegration,
  FeatureCommentPayload,
  Flag,
  GiphyMediaConfiguration,
  GoogleAuthIntegration,
  Invite,
  LiveConfiguration,
  Locale,
  MediaConfiguration,
  ModerationQueue,
  ModerationQueues,
  ModeratorNote,
  Mutation,
  OIDCAuthIntegration,
  PremodStatus,
  PremodStatusHistory,
  Profile,
  Query,
  Queue,
  Queues,
  RecentCommentHistory,
  RejectCommentPayload,
  Settings,
  SigningSecret,
  Site,
  SlackConfiguration,
  SSOAuthIntegration,
  Story,
  StorySettings,
  Subscription,
  SuspensionStatus,
  SuspensionStatusHistory,
  Tag,
  TwitterMediaConfiguration,
  Time,
  User,
  UserModerationScopes,
  UsernameHistory,
  UsernameStatus,
  UserStatus,
  WarningStatus,
  WarningStatusHistory,
  WebhookEndpoint,
  YouTubeMediaConfiguration,
};

export default Resolvers;
