import { fireEvent, prettyDOM, screen, within } from "@testing-library/react";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";
import getCommentRecursively from "coral-stream/test/helpers/getCommentRecursively";

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
  const { context } = create({
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
          settings: () => ({
            ...settings,
            flattenReplies: true,
          }),
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(true, "flattenReplies");
      localRecord.setValue(storyWithDeepestReplies.id, "storyID");
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

it.only("post a flattened reply", async () => {
  const commentBody = "PostFlattenReply: Hello world!";
  const { streamLog } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        createCommentReply: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            storyID: storyWithDeepestReplies.id,
            parentID: "comment-my-comment-7",
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
                parent: getCommentRecursively(
                  storyWithDeepestReplies.comments,
                  "comment-my-comment-7"
                ),
              },
            },
          };
        },
      },
    }),
  });

  const deepestReply = await within(streamLog).findByTestId(
    "comment-my-comment-7"
  );

  // Open reply form.
  const replyButton = within(deepestReply).getByLabelText(
    "Reply to comment by",
    { exact: false }
  );

  /* eslint-disable */
  console.log(prettyDOM(replyButton, 10000));

  fireEvent.click(replyButton);

  /* Wait for result */
  const form = await within(deepestReply).findByRole("form");
  // BOOKMARK: working on finding form

  // Write reply
  const rte = await screen.findByPlaceholderText("Post a comment", {
    exact: false,
  });
  fireEvent.change(rte, { value: commentBody });

  fireEvent.submit(form);
  /* Wait for results */
  const deepestReplyList = await within(streamLog).findByTestId(
    "commentReplyList-comment-my-comment-7"
  );

  // No reply list after depth 4
  await expect(
    async () =>
      await within(streamLog).findByTestId(
        "commentReplyList-comment-my-comment-7"
      )
  ).rejects.toThrow();
  // optimistic result
  await within(deepestReplyList).findByText(commentBody, { exact: false });

  // Final result
  await within(deepestReplyList).findByText("(from server)", { exact: false });
});
