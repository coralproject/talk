import Cursor from "coral-server/graph/common/scalars/cursor";
import Time from "coral-server/graph/common/scalars/time";
import { GQLResolver } from "coral-server/graph/tenant/schema/__generated__/types";

import { ApproveCommentPayload } from "./ApproveCommentPayload";
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
import { FeatureCommentPayload } from "./FeatureCommentPayload";
import { Flag } from "./Flag";
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
import { Subscription } from "./Subscription";
import { SuspensionStatus } from "./SuspensionStatus";
import { SuspensionStatusHistory } from "./SuspensionStatusHistory";
import { Tag } from "./Tag";
import { User } from "./User";
import { UserStatus } from "./UserStatus";

const Resolvers: GQLResolver = {
  ApproveCommentPayload,
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
  FeatureCommentPayload,
  Flag,
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
  Subscription,
  SuspensionStatus,
  SuspensionStatusHistory,
  Tag,
  Time,
  User,
  UserStatus,
};

export default Resolvers;
