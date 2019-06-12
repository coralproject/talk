import { GQLResolver, StoryToCommentsResolver } from "coral-framework/schema";
import {
  createQueryResolverOverwrite,
  CreateTestRendererParams,
  overwriteQueryResolver,
} from "coral-framework/testHelpers";
import { storyWithNoComments } from "coral-stream/test/fixtures";

import createTopLevel from "../create";

export default function create(params: CreateTestRendererParams) {
  return createTopLevel({
    ...params,
    resolvers: overwriteQueryResolver<GQLResolver>(params.resolvers || {}, {
      story: {
        comments: createQueryResolverOverwrite<StoryToCommentsResolver>(
          ({ variables }) => {
            // TODO: (cvle) Remove this overwrite once we have featured comment counts.
            if (variables.tag === "FEATURED") {
              return storyWithNoComments.comments;
            }
            return;
          }
        ),
      },
    }),
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
