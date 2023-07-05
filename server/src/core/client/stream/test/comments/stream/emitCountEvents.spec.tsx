import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import { commenters, settings, stories } from "../../fixtures";
import create from "./create";

const story = stories[0];
const viewer = commenters[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          stream: () => story,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(story.id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return {
    testRenderer,
    context,
  };
}

it("emit commentCount events", (done) => {
  void createTestRenderer().then(({ context: { eventEmitter } }) => {
    eventEmitter.on("commentCount", (args) => {
      expect(args).toMatchInlineSnapshot(`
        Object {
          "number": 2,
          "storyID": "story-1",
          "storyURL": "http://localhost/stories/story-1",
          "text": "Comments",
        }
      `);
      done();
    });
  });
});
