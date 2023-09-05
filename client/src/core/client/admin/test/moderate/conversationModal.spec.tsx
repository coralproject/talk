import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/common/lib/utils";
import {
  GQLCOMMENT_STATUS,
  GQLResolver,
  ModerationQueueToCommentsResolver,
  MutationToRejectCommentResolver,
} from "coral-framework/schema";
import {
  createMutationResolverStub,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import {
  comments,
  emptyModerationQueues,
  reportedComments,
  settings,
  site,
  siteConnection,
  users,
} from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");
});

const rejectCommentStub =
  createMutationResolverStub<MutationToRejectCommentResolver>(
    ({ variables }) => {
      expectAndFail(variables).toMatchObject({
        commentID: comments[0].id,
        commentRevisionID: comments[0].revision!.id,
      });
      return {
        comment: {
          ...comments[0],
          status: GQLCOMMENT_STATUS.REJECTED,
          statusHistory: {
            edges: [
              {
                node: {
                  id: "mod-action",
                  status: GQLCOMMENT_STATUS.REJECTED,
                  author: {
                    id: viewer.id,
                    username: viewer.username,
                  },
                },
              },
            ],
          },
        },
        moderationQueues: emptyModerationQueues,
      };
    }
  );

const reportedCommentsEdges = {
  edges: [
    {
      node: reportedComments[0],
      cursor: reportedComments[0].createdAt,
    },
  ],
  pageInfo: {
    endCursor: reportedComments[0].createdAt,
    hasNextPage: false,
  },
};

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          site: () => site,
          viewer: () => viewer,
          moderationQueues: () => emptyModerationQueues,
          comments: () => {
            return reportedCommentsEdges;
          },
          sites: () => siteConnection,
          comment: () => reportedComments[0],
        },
        Mutation: {
          rejectComment: rejectCommentStub,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  customRenderAppWithContext(context);

  return { context };
}

it("renders view conversation thread and allows comments to be rejected there", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () =>
            pureMerge(emptyModerationQueues, {
              reported: {
                count: 1,
                comments:
                  createQueryResolverStub<ModerationQueueToCommentsResolver>(
                    ({ variables }) => {
                      expectAndFail(variables).toEqual({
                        first: 5,
                        orderBy: "CREATED_AT_DESC",
                      });
                      return reportedCommentsEdges;
                    }
                  ) as any,
              },
            }),
        },
      }),
    });
  });
  const firstComment = screen.getByTestId(
    `moderate-comment-card-${reportedComments[0].id}`
  );
  const viewConversationButton = within(firstComment).getByRole("button", {
    name: "conversation-chat-text View Conversation",
  });
  await act(async () => {
    userEvent.click(viewConversationButton);
  });
  const modal = await screen.findByTestId("conversation-modal");

  const showRepliesButton = screen.getByRole("button", {
    name: "Show replies",
  });
  userEvent.click(showRepliesButton);

  // find first reply to comment and its reject button
  const firstReply = within(modal).getByTestId(
    `conversation-modal-comment-${comments[0].id}`
  );
  const rejectButtonReportedComment0 = within(firstReply).getByRole("button", {
    name: "Reject",
  });
  expect(rejectButtonReportedComment0).toHaveTextContent("Reject");

  // click reject
  userEvent.click(rejectButtonReportedComment0);

  // check that comment is rejected and the button text updates as expected
  expect(rejectCommentStub.called).toBe(true);
  expect(rejectButtonReportedComment0).toHaveTextContent("Rejected");

  // parent comment should still have button with Reject text
  const parentComment = within(modal).getByTestId(
    `conversation-modal-comment-${reportedComments[0].id}`
  );
  expect(parentComment).toHaveTextContent("Reject");
});
