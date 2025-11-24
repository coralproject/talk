import Logger from "bunyan";
import { Site } from "coral-server/models/site";
import { convert } from "html-to-text";
import fetch from "node-fetch";

import { Config } from "coral-server/config";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import { getURLWithCommentID, Story } from "coral-server/models/story";
import { User } from "coral-server/models/user";
import { shouldSendNotification } from "./filters";

const NotificationSource = "Coral";
const ProfileType = "Coral";

// From Coral input types

interface CreateReplyParams {
  from: User;
  to: User;

  story: Readonly<Story>;
  site: Readonly<Site>;
  parent: Comment;
  reply: Comment;
}

interface CreateRecParams {
  from: User;
  to: User;

  story: Readonly<Story>;
  site: Readonly<Site>;
  comment: Comment;
}

interface CreateApproveParams {
  to: User;

  story: Readonly<Story>;
  site: Readonly<Site>;
  comment: Comment;
}

interface CreateRejectParams {
  to: User;

  story: Readonly<Story>;
  site: Readonly<Site>;
  comment: Comment;
}

interface CreateFeatureParams {
  to: User;

  story: Readonly<Story>;
  site: Readonly<Site>;
  comment: Comment;
}

// To notifications service types

// eslint-disable-next-line no-shadow
enum NotificationType {
  CoralRec = "CoralRec",
  CoralReply = "CoralReply",
}

interface StoryInput {
  id: string;
  title: string;
  url: string;
}

interface SiteInput {
  id: string;
  name: string;
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

interface CommentInput {
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
  private _active: boolean;
  private url?: string | null;
  private apiKey?: string | null;
  private logger: Logger;

  constructor(config: Config, logger: Logger) {
    this.logger = logger;

    this._active = config.get("external_notifications");
    this.url = config.get("external_notifications_api_url");
    this.apiKey = config.get("external_notifications_api_key");
  }

  public active(): boolean {
    return !!(this._active && this.url && this.apiKey);
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
    const formatted = convert(latestRevision.body);
    const split = formatted.split(/(\s+)/);

    if (split.length < 50) {
      return split.join(" ");
    } else {
      return split.slice(0, 50).join(" ");
    }
  }

  private commentToInput(comment: Comment, story: Story): CommentInput {
    const url = getURLWithCommentID(story.url, comment.id);

    return {
      id: comment.id,
      storyId: comment.storyID,
      snippet: this.computeSnippetFromComment(comment),
      url,
    };
  }

  private storyToInput(story: Story): StoryInput {
    return {
      id: story.id,
      title: story.metadata?.title ?? "",
      url: story.url,
    };
  }

  private siteToInput(site: Site): SiteInput {
    return {
      id: site.id,
      name: site.name,
    };
  }

  public async createRec(input: CreateRecParams) {
    if (!this.active()) {
      return;
    }

    const shouldSend = shouldSendNotification(input.from.id, input.to);
    if (!shouldSend) {
      return false;
    }

    try {
      const data = {
        source: NotificationSource,
        type: NotificationType.CoralRec,
        from: this.userToExternalProfile(input.from),
        to: this.userToExternalProfile(input.to),
        story: this.storyToInput(input.story),
        site: this.siteToInput(input.site),
        comment: this.commentToInput(input.comment, input.story),
      };

      return await this.send(data);
    } catch (err) {
      this.logger.warn(
        { err, input },
        "an error occurred while sending a rec notification"
      );
    }

    return false;
  }

  public async createReply(input: CreateReplyParams) {
    if (!this.active()) {
      return false;
    }

    const shouldSend = shouldSendNotification(input.from.id, input.to);
    if (!shouldSend) {
      return false;
    }

    try {
      const data = {
        source: NotificationSource,
        type: NotificationType.CoralReply,
        from: this.userToExternalProfile(input.from),
        to: this.userToExternalProfile(input.to),
        story: this.storyToInput(input.story),
        site: this.siteToInput(input.site),
        comment: this.commentToInput(input.parent, input.story),
        reply: this.commentToInput(input.reply, input.story),
      };

      return await this.send(data);
    } catch (err) {
      this.logger.warn(
        { err, input },
        "an error occurred while sending a reply notification"
      );
    }

    return false;
  }

  public async createApprove(input: CreateApproveParams) {
    if (!this.active()) {
      return false;
    }

    try {
      const data = {
        source: NotificationSource,
        type: NotificationType.CoralReply,
        to: this.userToExternalProfile(input.to),
        story: this.storyToInput(input.story),
        site: this.siteToInput(input.site),
        comment: this.commentToInput(input.comment, input.story),
      };

      return await this.send(data);
    } catch (err) {
      this.logger.warn(
        { err, input },
        "an error occurred while sending a reply notification"
      );
    }

    return false;
  }

  public async createReject(input: CreateRejectParams) {
    if (!this.active()) {
      return false;
    }

    try {
      const data = {
        source: NotificationSource,
        type: NotificationType.CoralReply,
        to: this.userToExternalProfile(input.to),
        story: this.storyToInput(input.story),
        site: this.siteToInput(input.site),
        comment: this.commentToInput(input.comment, input.story),
      };

      return await this.send(data);
    } catch (err) {
      this.logger.warn(
        { err, input },
        "an error occurred while sending a reply notification"
      );
    }

    return false;
  }

  public async createFeature(input: CreateFeatureParams) {
    if (!this.active()) {
      return false;
    }

    try {
      const data = {
        source: NotificationSource,
        type: NotificationType.CoralReply,
        to: this.userToExternalProfile(input.to),
        story: this.storyToInput(input.story),
        site: this.siteToInput(input.site),
        comment: this.commentToInput(input.comment, input.story),
      };

      return await this.send(data);
    } catch (err) {
      this.logger.warn(
        { err, input },
        "an error occurred while sending a reply notification"
      );
    }

    return false;
  }

  private async send(notification: any) {
    if (!this.active()) {
      return false;
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
