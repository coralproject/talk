import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { reconstructTenantURL } from "coral-server/app/url";
import GraphContext from "coral-server/graph/context";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import {
  getStoryTitle,
  getURLWithCommentID,
  Story,
} from "coral-server/models/story";
import { User } from "coral-server/models/user";

import {
  GQLSlackChannel,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

export type Trigger =
  | "reported"
  | "pending"
  | "featured"
  | "created"
  | "staffCreated";

export default class SlackPublishEvent {
  public comment: Comment;
  public story: Story;
  public author: User;
  public actionType: Trigger;
  constructor(
    actionType: Trigger,
    comment: Comment,
    story: Story,
    author: User
  ) {
    this.actionType = actionType;
    this.comment = comment;
    this.story = story;
    this.author = author;
  }

  private getTriggers(): (Trigger | null)[] {
    if (
      this.actionType &&
      this.actionType === "created" &&
      this.authorIsStaff()
    ) {
      return ["staffCreated", "created"];
    }
    return [this.actionType];
  }

  private authorIsStaff() {
    return Boolean(
      this.author &&
        [
          GQLUSER_ROLE.ADMIN,
          GQLUSER_ROLE.MODERATOR,
          GQLUSER_ROLE.STAFF,
        ].includes(this.author.role)
    );
  }

  public getMessage(): string {
    const triggers = this.getTriggers();

    if (triggers.includes("staffCreated")) {
      return "This comment has been created by staff";
    }
    if (triggers.includes("created")) {
      return "This comment has been created";
    }
    if (triggers.includes("featured")) {
      return "This comment has been featured";
    }
    if (triggers.includes("pending")) {
      return "This comment is pending";
    }
    if (triggers.includes("reported")) {
      return "This comment has been reported";
    }

    throw new Error("invalid trigger");
  }

  public shouldPublishToChannel({ triggers }: GQLSlackChannel) {
    const triggerSet = this.getTriggers();
    return (
      (triggers.allComments && triggerSet.includes("created")) ||
      (triggers.featuredComments && triggerSet.includes("featured")) ||
      (triggers.reportedComments && triggerSet.includes("reported")) ||
      (triggers.pendingComments && triggerSet.includes("pending")) ||
      (triggers.staffComments && triggerSet.includes("staffCreated"))
    );
  }

  public getContent({ loaders, config, tenant, req }: GraphContext) {
    const storyTitle = getStoryTitle(this.story);
    const moderateLink = reconstructTenantURL(
      config,
      tenant,
      req,
      `/admin/moderate/comment/${this.comment.id}`
    );
    const commentLink = getURLWithCommentID(this.story.url, this.comment.id);

    const body = getHTMLPlainText(getLatestRevision(this.comment).body);
    return {
      text: body,
      blocks: [
        {
          type: "section",
          block_id: "title-block",
          text: {
            type: "mrkdwn",
            text: `${this.getMessage()} on *<${this.story.url}|${storyTitle}>*`,
          },
        },
        { type: "divider" },
        {
          type: "section",
          block_id: "body-block",
          text: {
            type: "plain_text",
            text: body,
          },
        },
        {
          type: "context",
          block_id: "footer-block",
          elements: [
            {
              type: "mrkdwn",
              text: `Authored by *${this.author.username}* | <${moderateLink}|Go to Moderation> | <${commentLink}|See Comment>`,
            },
          ],
        },
        { type: "divider" },
      ],
    };
  }
}
