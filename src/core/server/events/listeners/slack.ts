import { reconstructTenantURL } from "coral-server/app/url";
import GraphContext from "coral-server/graph/context";
import logger from "coral-server/logger";
import { getLatestRevision } from "coral-server/models/comment";
import { getStoryTitle, getURLWithCommentID } from "coral-server/models/story";
import { createFetch } from "coral-server/services/fetch";

import { GQLMODERATION_QUEUE } from "coral-server/graph/schema/__generated__/types";

import {
  CommentEnteredModerationQueueCoralEventPayload,
  CommentFeaturedCoralEventPayload,
  CoralEventType,
} from "../events";
import { CoralEventListener, CoralEventPublisherFactory } from "../publisher";

type SlackCoralEventListenerPayloads =
  | CommentFeaturedCoralEventPayload
  | CommentEnteredModerationQueueCoralEventPayload;

type Trigger = "reported" | "pending" | "featured";

export class SlackCoralEventListener
  implements CoralEventListener<SlackCoralEventListenerPayloads> {
  public readonly name = "slack";
  public readonly events = [
    CoralEventType.COMMENT_FEATURED,
    CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE,
  ];
  private readonly fetch = createFetch({ name: "slack" });

  private payloadTrigger(
    payload: SlackCoralEventListenerPayloads
  ): Trigger | null {
    switch (payload.type) {
      case CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE:
        if (payload.data.queue === GQLMODERATION_QUEUE.REPORTED) {
          return "reported";
        } else if (payload.data.queue === GQLMODERATION_QUEUE.PENDING) {
          return "pending";
        }
        break;
      case CoralEventType.COMMENT_FEATURED:
        return "featured";
    }

    return null;
  }

  /**
   * postMessage will prepare and send the incoming Slack webhook.
   *
   * @param ctx context of the request
   * @param message the message prefix for the request
   * @param payload payload for the event that occurred
   * @param hookURL url to the Slack webhook that we should send the message to
   */
  private async postMessage(
    { loaders, config, tenant, req }: GraphContext,
    message: string,
    payload: SlackCoralEventListenerPayloads,
    hookURL: string
  ) {
    // Get the comment.
    const comment = await loaders.Comments.comment.load(payload.data.commentID);
    if (!comment || !comment.authorID) {
      return;
    }

    // Get the story.
    const story = await loaders.Stories.story.load(payload.data.storyID);
    if (!story) {
      return;
    }

    // Get the author.
    const author = await loaders.Users.user.load(comment.authorID);
    if (!author) {
      return;
    }

    // Get some properties about the event.
    const storyTitle = getStoryTitle(story);
    const commentBody = getLatestRevision(comment).body;
    const moderateLink = reconstructTenantURL(
      config,
      tenant,
      req,
      `/admin/moderate/comment/${comment.id}`
    );
    const commentLink = getURLWithCommentID(story.url, comment.id);

    // Replace HTML link breaks with newlines.
    const body = commentBody.replace(/<br\/?>/g, "\n");

    // Send the post to the Slack URL. We don't wrap this in a try/catch because
    // it's handled in the calling function.
    const res = await this.fetch(hookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `${message} on *<${story.url}|${storyTitle}>*`,
        attachments: [
          {
            text: body,
            footer: `Authored by *${author.username}* | <${moderateLink}|Go to Moderation> | <${commentLink}|See Comment>`,
          },
        ],
      }),
    });

    // Check that the request was completed successfully.
    if (!res.ok) {
      throw new Error(`slack returned non-200 status code: ${res.status}`);
    }
  }

  private getMessage(trigger: Trigger): string {
    switch (trigger) {
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

  public initialize: CoralEventPublisherFactory<
    SlackCoralEventListenerPayloads
  > = ctx => async payload => {
    const {
      tenant: { id: tenantID, slack },
    } = ctx;

    if (
      // If slack is not defined,
      !slack ||
      // Or there are no slack channels,
      slack.channels.length === 0 ||
      // Or each channel isn't enabled or configured right.
      slack.channels.every(c => !c.enabled || !c.hookURL)
    ) {
      // Exit out then.
      return;
    }

    // Get the trigger that is associated with this payload.
    const trigger = this.payloadTrigger(payload);
    if (!trigger) {
      return;
    }

    // For each channel that is enabled with configuration.
    for (const channel of slack.channels) {
      if (!channel.enabled || !channel.hookURL) {
        continue;
      }

      if (
        // If featured comments are, and it's a featured comment,
        (channel.triggers.featuredComments && trigger === "featured") ||
        // Or reported comments are, and it's a reported comment,
        (channel.triggers.reportedComments && trigger === "reported") ||
        // Or pending comments are, and it's a pending comment,
        (channel.triggers.pendingComments && trigger === "pending")
      ) {
        try {
          // Post the message to slack.
          await this.postMessage(
            ctx,
            this.getMessage(trigger),
            payload,
            channel.hookURL
          );
        } catch (err) {
          logger.error(
            { err, tenantID, payload, channel },
            "could not post the comment to slack"
          );
        }
      }
    }
  };
}
