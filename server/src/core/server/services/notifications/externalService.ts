import Logger from "bunyan";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import { getURLWithCommentID, retrieveStory } from "coral-server/models/story";
import { User } from "coral-server/models/user";
import htmlToText from "html-to-text";

const NotificationSource = "Coral";
const ProfileType = "Coral";

// From Coral input types

interface CreateReplyInput {
  from: User;
  to: User;
  parent: Comment;
  reply: Comment;
}

interface CreateRecInput {
  from: User;
  to: User;
  comment: Comment;
}

// To notifications service types

// eslint-disable-next-line no-shadow
enum NotificationType {
  CoralRec = "CoralRec",
  CoralReply = "CoralReply",
}

interface ExternalUserProfile {
  id: string;
  type: string;
  username?: string;
  email?: string;
  profileUrl?: string;
  avatarUrl?: string;
  ssoIds?: string[];
}

interface CommentPayload {
  id: string;
  storyId: string;
  snippet?: string | null;
  url?: string | null;
}

const CreateNotificationsMutation = `
  mutation CreateNotificationsMutation(
    $input: CreateNotificationsInput!
  ) {
    createNotifications(input: $input) {
      id
    }
  }
`;

export class ExternalNotificationsService {
  private url?: string | null;
  private apiKey?: string | null;
  private logger: Logger;
  private mongo: MongoContext;

  constructor(config: Config, logger: Logger, mongo: MongoContext) {
    this.logger = logger;
    this.mongo = mongo;

    this.url = config.get("external_notifications_api_url");
    this.apiKey = config.get("external_notifications_api_key");
  }

  public active(): boolean {
    return !!(this.url && this.apiKey);
  }

  private userToExternalProfile(user: User): ExternalUserProfile {
    return {
      id: user.id,
      type: ProfileType,
      username: user.username,
      email: user.email,
      profileUrl: user.ssoURL,
      avatarUrl: user.avatar,
    };
  }

  private computeSnippetFromComment(comment: Comment): string {
    const latestRevision = getLatestRevision(comment);
    const formatted = htmlToText.convert(latestRevision.body);
    const split = formatted.split(/(\s+)/);

    if (split.length < 50) {
      return split.join(" ");
    } else {
      return split.slice(0, 50).join(" ");
    }
  }

  private async commentToPayload(comment: Comment): Promise<CommentPayload> {
    const story = await retrieveStory(
      this.mongo,
      comment.tenantID,
      comment.storyID
    );
    const url = story ? getURLWithCommentID(story.url, comment.id) : null;

    return {
      id: comment.id,
      storyId: comment.storyID,
      snippet: this.computeSnippetFromComment(comment),
      url,
    };
  }

  public async createRec(input: CreateRecInput) {
    if (!this.active()) {
      return;
    }

    const data = {
      source: NotificationSource,
      type: NotificationType.CoralRec,
      from: this.userToExternalProfile(input.from),
      to: this.userToExternalProfile(input.to),
      storyId: input.comment.storyID,
      comment: this.commentToPayload(input.comment),
    };

    return await this.send(data);
  }

  public async createReply(input: CreateReplyInput) {
    if (!this.active()) {
      return;
    }

    const data = {
      source: NotificationSource,
      type: NotificationType.CoralReply,
      from: this.userToExternalProfile(input.from),
      to: this.userToExternalProfile(input.to),
      storyId: input.parent.storyID,
      comment: await this.commentToPayload(input.parent),
      reply: await this.commentToPayload(input.reply),
    };

    return await this.send(data);
  }

  private async send(notification: any) {
    if (!this.active()) {
      return;
    }

    const data = {
      query: CreateNotificationsMutation,
      variables: {
        input: {
          items: [notification],
        },
      },
    };

    const response = await fetch(this.url!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-notifications-api-key": this.apiKey!,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      this.logger.info(
        { status: response.status, text: await response.text() },
        "error while sending external notifications info"
      );

      return false;
    }

    return true;
  }
}
