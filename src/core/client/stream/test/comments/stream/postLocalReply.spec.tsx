import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import waitForRTE from "coral-stream/test/helpers/waitForRTE";

import {
  baseComment,
  commenters,
  settings,
  storyWithDeepestReplies,
} from "../../fixtures";
import create from "./create";

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          stream: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              id: storyWithDeepestReplies.id,
              url: null,
              mode: null,
            });
            return storyWithDeepestReplies;
          },
          viewer: () => commenters[0],
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

it("post a local reply", async () => {
  const commentBody = "PostLocalReply: Hello world!";
  const { streamLog } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        createCommentReply: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            storyID: storyWithDeepestReplies.id,
            parentID: "comment-with-deepest-replies-6",
            parentRevisionID: "revision-0",
            body: commentBody,
          });
          return {
            edge: {
              cursor: "",
              node: {
                ...baseComment,
                id: "comment-x",
                author: commenters[0],
                body: commentBody + " (from server)",
              },
            },
          };
        },
      },
    }),
  });

  const deepestReply = within(streamLog).getByTestID(
    "comment-comment-with-deepest-replies-6"
  );

  const form = await act(async () => {
    /* Do stuff */
    // Open reply form.
    within(deepestReply)
      .getByLabelText("Reply to comment by", { exact: false })
      .props.onClick();
    /* Wait for result */
    return await waitForElement(() => within(deepestReply).getByType("form"));
  });

  await act(async () => {
    /* Do stuff */
    // Write reply
    const rte = await waitForRTE(streamLog, "Write a reply");
    rte.props.onChange(commentBody);
    form.props.onSubmit();
    /* Wait for results */
    const deepestReplyList = await waitForElement(() =>
      within(streamLog).getByTestID(
        "commentReplyList-comment-with-deepest-replies-6"
      )
    );

    // optimistic result
    await wait(() =>
      within(deepestReplyList).getByText(commentBody, { exact: false })
    );
    // Final result
    await waitForElement(() =>
      within(deepestReplyList).getByText("(from server)", { exact: false })
    );
  });
});
