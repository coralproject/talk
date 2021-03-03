import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import { GQLResolver } from "coral-framework/testHelpers/schema";

import { comments, settings, storyWithDeepestReplies } from "../../fixtures";
import create from "./create";

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          story: () => storyWithDeepestReplies,
          stream: () => storyWithDeepestReplies,
          comment: ({ variables }) => {
            expectAndFail(variables.id).toBe("comment-with-deepest-replies-3");
            return {
              ...comments[0],
              id: "comment-with-deepest-replies-3",
            };
          },
          settings: () => settings,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(storyWithDeepestReplies.id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  const streamLog = await act(
    async () =>
      await waitForElement(() =>
        within(testRenderer.root).getByTestID("comments-allComments-log")
      )
  );

  return {
    testRenderer,
    context,
    streamLog,
  };
};

it("renders deepest comment with link", async () => {
  const { streamLog } = await createTestRenderer();
  const deepestReply = within(streamLog).getByTestID(
    "comment-comment-with-deepest-replies-3"
  );
  within(streamLog).getByText("Read More of this Conversation", {
    exact: false,
  });
  expect(within(deepestReply).toJSON()).toMatchSnapshot();
});

describe("flatten replies", () => {
  it("doesn't renders deepest comment with link", async () => {
    const { streamLog } = await createTestRenderer({
      initLocalState: (local) => {
        local.setValue(true, "flattenReplies");
      },
    });
    expect(() =>
      within(streamLog).getByText("Read More of this Conversation", {
        exact: false,
      })
    ).toThrow();
  });
});

it("shows conversation", async () => {
  const mockEvent = {
    preventDefault: sinon.mock().once(),
  };
  const { streamLog, testRenderer } = await createTestRenderer();
  await act(async () => {
    within(streamLog)
      .getByText("Read More of this Conversation", { exact: false })
      .props.onClick(mockEvent);

    await waitForElement(() =>
      within(testRenderer.root).getByText(
        "You are currently viewing a single conversation",
        {
          exact: false,
        }
      )
    );
  });
});
