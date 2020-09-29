import { inject, singleton } from "tsyringe";

import { CONFIG, Config } from "coral-server/config";
import { retrieveComment } from "coral-server/models/comment";
import { retrieveStory } from "coral-server/models/story";
import { retrieveUser } from "coral-server/models/user";
import { createFetch } from "coral-server/services/fetch";
import { MONGO, Mongo } from "coral-server/services/mongodb";

import { GQLMODERATION_QUEUE } from "coral-server/graph/schema/__generated__/types";

import {
  CommentCreatedCoralEventPayload,
  CommentEnteredModerationQueueCoralEventPayload,
  CommentFeaturedCoralEventPayload,
  CommentReplyCreatedCoralEventPayload,
} from "../../events";
import { CoralEventHandler, CoralEventListener } from "../../listener";
import { CoralEventType } from "../../types";
import SlackPublishEvent, { Trigger } from "./publishEvent";

type SlackCoralEventListenerPayloads =
  | CommentFeaturedCoralEventPayload
  | CommentEnteredModerationQueueCoralEventPayload
  | CommentCreatedCoralEventPayload
  | CommentReplyCreatedCoralEventPayload;

@singleton()
export class SlackCoralEventListener
  implements CoralEventListener<SlackCoralEventListenerPayloads> {
  public readonly name = "slack";
  public readonly events = [
    CoralEventType.COMMENT_FEATURED,
    CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE,
    CoralEventType.COMMENT_CREATED,
    CoralEventType.COMMENT_REPLY_CREATED,
  ];
  private readonly fetch = createFetch({ name: "slack" });

  constructor(
    @inject(MONGO) private readonly mongo: Mongo,
    @inject(CONFIG) private readonly config: Config
  ) {}

  /**
   * postMessage will prepare and send the incoming Slack webhook.
   *
   * @param hookURL url to the Slack webhook that we should send the message to
   * @param content the content for the message
   */
  private async postMessage(hookURL: string, content: any) {
    // Send the post to the Slack URL. We don't wrap this in a try/catch because
    // it's handled in the calling function.
    const res = await this.fetch(hookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    // Check that the request was completed successfully.
    if (!res.ok) {
      throw new Error(`slack returned non-200 status code: ${res.status}`);
    }
  }

  private getActionType(
    payload: SlackCoralEventListenerPayloads
  ): Trigger | null {
    switch (payload.type) {
      case CoralEventType.COMMENT_CREATED:
      case CoralEventType.COMMENT_REPLY_CREATED:
        return "created";
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

  public handle: CoralEventHandler<SlackCoralEventListenerPayloads> = async (
    ctx,
    payload
  ) => {
    const {
      tenant: { id: tenantID, slack },
    } = ctx;

    if (
      // If slack is not defined,
      !slack ||
      // Or there are no slack channels,
      slack.channels.length === 0 ||
      // Or each channel isn't enabled or configured right.
      slack.channels.every((c) => !c.enabled || !c.hookURL)
    ) {
      // Exit out then.
      return;
    }

    const actionType = this.getActionType(payload);
    if (!actionType) {
      return;
    }

    const comment = await retrieveComment(
      this.mongo,
      ctx.tenant.id,
      payload.data.commentID
    );
    if (!comment || !comment.authorID) {
      return;
    }

    const author = await retrieveUser(
      this.mongo,
      ctx.tenant.id,
      comment.authorID
    );
    if (!author) {
      return;
    }

    const story = await retrieveStory(
      this.mongo,
      ctx.tenant.id,
      payload.data.storyID
    );
    if (!story) {
      return;
    }

    const publishEvent = new SlackPublishEvent(
      this.config,
      actionType,
      comment,
      story,
      author
    );

    // For each channel that is enabled with Configuration.
    for (const channel of slack.channels) {
      if (!channel.enabled || !channel.hookURL) {
        continue;
      }

      if (publishEvent.shouldPublishToChannel(channel)) {
        try {
          // Post the message to slack.
          await this.postMessage(channel.hookURL, publishEvent.getContent(ctx));
        } catch (err) {
          ctx.logger.error(
            { err, tenantID, payload, channel },
            "could not post the comment to slack"
          );
        }
      }
    }
  };
}
