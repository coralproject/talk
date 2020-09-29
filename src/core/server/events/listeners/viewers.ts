import { inject, singleton } from "tsyringe";

import { CONFIG, Config } from "coral-server/config";
import { createStoryViewer } from "coral-server/models/story/viewers";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { Redis, REDIS } from "coral-server/services/redis";

import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

import {
  CommentCreatedCoralEventPayload,
  CommentReactionCreatedCoralEventPayload,
  CommentReplyCreatedCoralEventPayload,
} from "../events";
import { CoralEventHandler, CoralEventListener } from "../listener";
import { CoralEventType } from "../types";

type ViewersCoralEventListenerPayloads =
  | CommentReplyCreatedCoralEventPayload
  | CommentCreatedCoralEventPayload
  | CommentReactionCreatedCoralEventPayload;

@singleton()
export class ViewersCoralEventListener
  implements CoralEventListener<ViewersCoralEventListenerPayloads> {
  public readonly name = "viewers";
  public readonly events = [
    CoralEventType.COMMENT_REPLY_CREATED,
    CoralEventType.COMMENT_CREATED,
    CoralEventType.COMMENT_REACTION_CREATED,
  ];

  constructor(
    @inject(REDIS) private readonly redis: Redis,
    @inject(CONFIG) private readonly config: Config
  ) {}

  public handle: CoralEventHandler<ViewersCoralEventListenerPayloads> = async (
    { clientID, tenant },
    { data }
  ) => {
    if (!clientID) {
      return;
    }

    // If the feature flag isn't enabled, then we have nothing to do!
    if (!hasFeatureFlag(tenant, GQLFEATURE_FLAG.VIEWER_COUNT)) {
      return;
    }

    await createStoryViewer(
      this.redis,
      {
        tenantID: tenant.id,
        siteID: data.siteID,
        storyID: data.storyID,
      },
      clientID,
      this.config.get("story_viewer_timeout")
    );
  };
}
