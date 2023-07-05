import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_STATUS,
  GQLResolver,
  MutationToApproveCommentResolver,
  MutationToRejectCommentResolver,
  QueryToCommentResolver,
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
  emptyModerationQueues,
  rejectedComments,
  reportedComments,
  settings,
  users,
} from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");
});

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
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

const comment = rejectedComments[0];
const commentStub = createQueryResolverStub<QueryToCommentResolver>(
  ({ variables }) => {
    expectAndFail(variables).toEqual({ id: comment.id });
    return reportedComments[0];
  }
);

beforeEach(() => {
  replaceHistoryLocation(
    `http://localhost/admin/moderate/comment/${comment.id}`
  );
});

it("renders single comment view with story info", async () => {
  await createTestRenderer({
    resolvers: {
      Query: {
        comment: commentStub,
      },
    },
  });
  const singleModerateContainer = await screen.findByTestId(
    "single-moderate-container"
  );
  expect(
    within(singleModerateContainer).queryByText("Comment On")
  ).toBeInTheDocument();
  expect(
    within(singleModerateContainer).queryByRole("link", {
      name: "Moderate Story",
    })
  ).toBeInTheDocument();
});

it("approves single comment", async () => {
  const approveCommentStub =
    createMutationResolverStub<MutationToApproveCommentResolver>(
      ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          commentID: comment.id,
          commentRevisionID: comment.revision!.id,
        });
        return {
          comment: {
            ...comment,
            status: GQLCOMMENT_STATUS.APPROVED,
            statusHistory: {
              edges: [
                {
                  node: {
                    id: "mod-action",
                    status: GQLCOMMENT_STATUS.APPROVED,
                    moderator: {
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

  await createTestRenderer({
    resolvers: {
      Query: {
        comment: commentStub,
      },
      Mutation: {
        approveComment: approveCommentStub,
      },
    },
  });
  const approveButton = await screen.findByLabelText("Approve");
  userEvent.click(approveButton);

  expect(approveCommentStub.called).toBe(true);
});

it("rejects single comment", async () => {
  const rejectCommentStub =
    createMutationResolverStub<MutationToRejectCommentResolver>(
      ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          commentID: comment.id,
          commentRevisionID: comment.revision!.id,
        });
        return {
          comment: {
            ...comment,
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

  await createTestRenderer({
    resolvers: {
      Query: {
        comment: commentStub,
      },
      Mutation: {
        rejectComment: rejectCommentStub,
      },
    },
  });

  const rejectButton = await screen.findByLabelText("Reject");
  userEvent.click(rejectButton);

  expect(rejectCommentStub.called).toBe(true);
});
