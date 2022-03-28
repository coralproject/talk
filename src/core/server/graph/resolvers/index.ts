import Cursor from "coral-server/graph/scalars/cursor";
import Locale from "coral-server/graph/scalars/locale";
import Time from "coral-server/graph/scalars/time";

import { GQLResolver } from "coral-server/graph/schema/__generated__/types";

import { AkismetExternalIntegration } from "./AkismetExternalIntegration";
import { ApproveCommentPayload } from "./ApproveCommentPayload";
import { AuthenticationTargetFilter } from "./AuthenticationTargetFilter";
import { AuthIntegrations } from "./AuthIntegrations";
import { BanStatus } from "./BanStatus";
import { BanStatusHistory } from "./BanStatusHistory";
import { CloseCommenting } from "./CloseCommenting";
import { Comment } from "./Comment";
import { CommentCounts } from "./CommentCounts";
import { CommentCreatedPayload } from "./CommentCreatedPayload";
import { CommentEditedPayload } from "./CommentEditedPayload";
import { CommentEnteredModerationQueuePayload } from "./CommentEnteredModerationQueuePayload";
import { CommentEnteredPayload } from "./CommentEnteredPayload";
import { CommentLeftModerationQueuePayload } from "./CommentLeftModerationQueuePayload";
import { CommentMedia } from "./CommentMedia";
import { CommentModerationAction } from "./CommentModerationAction";
import { CommentReleasedPayload } from "./CommentReleasedPayload";
import { CommentReplyCreatedPayload } from "./CommentReplyCreatedPayload";
import { CommentRevision } from "./CommentRevision";
import { CommentStatusUpdatedPayload } from "./CommentStatusUpdatedPayload";
import { DisableCommenting } from "./DisableCommenting";
import { EditInfo } from "./EditInfo";
import { EmailDomain } from "./EmailDomain";
import { ExternalMediaConfiguration } from "./ExternalMediaConfiguration";
import { ExternalModerationPhase } from "./ExternalModerationPhase";
import { FacebookAuthIntegration } from "./FacebookAuthIntegration";
import { FeatureCommentPayload } from "./FeatureCommentPayload";
import { Flag } from "./Flag";
import { GiphyMediaConfiguration } from "./GiphyMediaConfiguration";
import { GoogleAuthIntegration } from "./GoogleAuthIntegration";
import { Invite } from "./Invite";
import { LiveConfiguration } from "./LiveConfiguration";
import { LocalAuthIntegration } from "./LocalAuthIntegration";
import { MediaConfiguration } from "./MediaConfiguration";
import { ModerationQueue } from "./ModerationQueue";
import { ModerationQueues } from "./ModerationQueues";
import { ModeratorNote } from "./ModeratorNote";
import { ModMessageStatus } from "./ModMessageStatus";
import { ModMessageStatusHistory } from "./ModMessageStatusHistory";
import { Mutation } from "./Mutation";
import { NewCommentersConfiguration } from "./NewCommentersConfiguration";
import { OIDCAuthIntegration } from "./OIDCAuthIntegration";
import { PremodStatus } from "./PremodStatus";
import { PremodStatusHistory } from "./PremodStatusHistory";
import { Profile } from "./Profile";
import { Query } from "./Query";
import { Queue } from "./Queue";
import { Queues } from "./Queues";
import { Reaction } from "./Reaction";
import { RecentCommentHistory } from "./RecentCommentHistory";
import { RejectCommentPayload } from "./RejectCommentPayload";
import { RTEConfiguration } from "./RTEConfiguration";
import { Settings } from "./Settings";
import { SigningSecret } from "./SigningSecret";
import { Site } from "./Site";
import { SlackConfiguration } from "./SlackConfiguration";
import { SSOAuthIntegration } from "./SSOAuthIntegration";
import { BadgeConfiguration } from "./StaffConfig";
import { Story } from "./Story";
import { StoryRatings } from "./StoryRatings";
import { StoryScrapingConfiguration } from "./StoryScrapingConfiguration";
import { StorySettings } from "./StorySettings";
import { Subscription } from "./Subscription";
import { SuspensionStatus } from "./SuspensionStatus";
import { SuspensionStatusHistory } from "./SuspensionStatusHistory";
import { Tag } from "./Tag";
import { TwitterMediaConfiguration } from "./TwitterMediaConfiguration";
import { User } from "./User";
import { UserMediaSettings } from "./UserMediaSettings";
import { UserMembershipScopes } from "./UserMembershipScopes";
import { UserModerationScopes } from "./UserModerationScopes";
import { UsernameHistory } from "./UsernameHistory";
import { UsernameStatus } from "./UsernameStatus";
import { UserStatus } from "./UserStatus";
import { WarningStatus } from "./WarningStatus";
import { WarningStatusHistory } from "./WarningStatusHistory";
import { WebhookEndpoint } from "./WebhookEndpoint";
import { YouTubeMediaConfiguration } from "./YouTubeMediaConfiguration";

const Resolvers: GQLResolver = {
  AkismetExternalIntegration,
  ApproveCommentPayload,
  AuthIntegrations,
  BanStatus,
  BanStatusHistory,
  CloseCommenting,
  Comment,
  CommentCounts,
  CommentCreatedPayload,
  CommentEditedPayload,
  CommentEnteredModerationQueuePayload,
  CommentEnteredPayload,
  CommentLeftModerationQueuePayload,
  CommentMedia,
  CommentModerationAction,
  CommentReleasedPayload,
  CommentReplyCreatedPayload,
  CommentRevision,
  CommentStatusUpdatedPayload,
  Cursor,
  DisableCommenting,
  EditInfo,
  EmailDomain,
  ExternalMediaConfiguration,
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
  ModMessageStatus,
  ModMessageStatusHistory,
  Mutation,
  NewCommentersConfiguration,
  OIDCAuthIntegration,
  PremodStatus,
  PremodStatusHistory,
  Profile,
  Query,
  Queue,
  Queues,
  Reaction,
  RecentCommentHistory,
  RejectCommentPayload,
  RTEConfiguration,
  Settings,
  SigningSecret,
  Site,
  SlackConfiguration,
  SSOAuthIntegration,
  BadgeConfiguration,
  Story,
  StoryRatings,
  StoryScrapingConfiguration,
  StorySettings,
  Subscription,
  SuspensionStatus,
  SuspensionStatusHistory,
  Tag,
  Time,
  TwitterMediaConfiguration,
  User,
  UserMediaSettings,
  UserMembershipScopes,
  UserModerationScopes,
  UsernameHistory,
  UsernameStatus,
  UserStatus,
  WarningStatus,
  WarningStatusHistory,
  WebhookEndpoint,
  YouTubeMediaConfiguration,
  LocalAuthIntegration,
  AuthenticationTargetFilter,
};

export default Resolvers;
