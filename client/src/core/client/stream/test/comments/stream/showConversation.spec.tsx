import { act, fireEvent, screen, within } from "@testing-library/react";

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
            expectAndFail(variables.id).toBe("comment-with-deepest-replies-6");
            return {
              ...comments[0],
              id: "comment-with-deepest-replies-6",
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

  return {
    context,
  };
};

it("renders deepest comment with link", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const streamLog = await screen.findByTestId("comments-allComments-log");
  await within(streamLog).findByTestId(
    "comment-comment-with-deepest-replies-6"
  );

  await within(streamLog).findByText("Read More of this Conversation", {
    exact: false,
  });
});

describe("flatten replies", () => {
  it("doesn't renders deepest comment with link", async () => {
    await act(async () => {
      await createTestRenderer({
        initLocalState: (local) => {
          local.setValue(true, "flattenReplies");
        },
      });
    });
    const streamLog = await screen.findByTestId("comments-allComments-log");

    await expect(
      async () =>
        await within(streamLog).findByText("Read More of this Conversation >")
    ).rejects.toThrow();
  });
});

it("shows conversation", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const streamLog = await screen.findByTestId("comments-allComments-log");

  const readMore = await within(streamLog).findByText(
    "Read More of this Conversation",
    { exact: false }
  );

  fireEvent.click(readMore);

  await screen.findByText("You are currently viewing a single conversation", {
    exact: false,
  });
});
