import striptags from "striptags";

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

export type Trigger = "reported" | "pending" | "featured" | "created";

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

  private getTrigger(): Trigger | "staffCreated" | null {
    if (
      this.actionType &&
      this.actionType === "created" &&
      this.authorIsStaff()
    ) {
      return "staffCreated";
    }
    return this.actionType;
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
    switch (this.getTrigger()) {
      case "created":
        return "This comment has been created";
      case "staffCreated":
        return "This comment has been created by staff";
      case "featured":
        return "This comment has been featured";
      case "pending":
        return "This comment is pending";
      case "reported":
        return "This comment has been reported";
      default:
        throw new Error("invalid trigger");
    }
  }

  public shouldPublishToChannel({ triggers }: GQLSlackChannel) {
    const trigger = this.getTrigger();
    return (
      (triggers.allComments && trigger === "created") ||
      (triggers.featuredComments && trigger === "featured") ||
      (triggers.reportedComments && trigger === "reported") ||
      (triggers.pendingComments && trigger === "pending") ||
      (triggers.staffComments && trigger === "staffCreated")
    );
  }

  public getBlocks({ loaders, config, tenant, req }: GraphContext) {
    const storyTitle = getStoryTitle(this.story);
    const moderateLink = reconstructTenantURL(
      config,
      tenant,
      req,
      `/admin/moderate/comment/${this.comment.id}`
    );
    const commentLink = getURLWithCommentID(this.story.url, this.comment.id);

    // Replace HTML link breaks with newlines.
    const body = striptags(getLatestRevision(this.comment).body);
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${this.getMessage()} on *<${this.story.url}|${storyTitle}>*`,
        },
      },
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: body,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Authored by *${this.author.username}* | <${moderateLink}|Go to Moderation> | <${commentLink}|See Comment>`,
          },
        ],
      },
      { type: "divider" },
    ];
  }
}
