import { screen } from "@testing-library/react";
import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import { commenters, settings, stories } from "coral-stream/test/fixtures";

import customRenderAppWithContext from "../../customRenderAppWithContext";
import create from "../create";

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => commenters[0],
          story: () => stories[0],
          stream: () => stories[0],
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(stories[0].id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  customRenderAppWithContext(context);

  const container = await screen.findByTestId("comments-allComments-log");

  return { container, context };
}

it("preserves pending comment between refreshes", async () => {
  const { container } = await createTestRenderer();
  expect(container).toBeInTheDocument();

  const commentForm = screen.getByRole("form");
  screen.debug(commentForm);
  const commentField = screen.getByTestId("comments-postCommentForm-field");
  expect(commentField).toBeDefined();
});
