import { fireEvent, screen, within } from "@testing-library/react";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import { comments, settings, storyWithDeepestReplies } from "../../fixtures";
import create from "./create";

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          story: () => storyWithDeepestReplies,
          stream: () => storyWithDeepestReplies,
          comment: ({ variables }) => {
            expectAndFail(variables.id).toBe("my-comment-7");
            return {
              ...comments[0],
              id: "comment-with-deepest-replies-7",
            };
          },
          settings: () => settings,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(storyWithDeepestReplies.id, "storyID");
      localRecord.setValue(false, "flattenReplies");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  customRenderAppWithContext(context);

  const streamLog = await screen.findByTestId("comments-allComments-log");

  return {
    context,
    streamLog,
  };
};

it("renders deepest comment with link", async () => {
  const { streamLog } = await createTestRenderer();
  await within(streamLog).findByTestId("comment-comment-with-deepest-replies");

  await within(streamLog).findByText("Read More of this Conversation", {
    exact: false,
  });
});

describe("flatten replies", () => {
  it("doesn't renders deepest comment with link", async () => {
    const { streamLog } = await createTestRenderer({
      initLocalState: (local) => {
        local.setValue(true, "flattenReplies");
      },
    });
    await expect(
      async () =>
        await within(streamLog).findByText("Read More of this Conversation >")
    ).rejects.toThrow();
  });
});

it("shows conversation", async () => {
  const { streamLog } = await createTestRenderer();
  const readMore = await within(streamLog).findByText(
    "Read More of this Conversation",
    { exact: false }
  );

  fireEvent.click(readMore);

  await screen.findByText("You are currently viewing a single conversation", {
    exact: false,
  });
});
