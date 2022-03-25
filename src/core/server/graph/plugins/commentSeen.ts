import { ApolloServerPlugin } from "apollo-server-plugin-base";

import { markSeenComments } from "coral-server/models/seenComments/seenComments";

import GraphContext from "../context";

export const CommentSeenServerPlugin: ApolloServerPlugin<GraphContext> = {
  requestDidStart() {
    return {
      willSendResponse({ context }) {
        process.nextTick(() => {
          for (const [key, commentIDs] of context.seenComments) {
            const split = key.split(":");
            const userID = split[0];
            const storyID = split[1];

            markSeenComments(
              context.mongo,
              context.tenant.id,
              storyID,
              userID,
              commentIDs,
              context.now
            )
              .then(() => {
                context.logger.debug(
                  { inserted: commentIDs.length },
                  "completed insertion of seenComments"
                );
              })
              .catch((error) => {
                context.logger.error(error);
              });
          }
        });
      },
    };
  },
};
