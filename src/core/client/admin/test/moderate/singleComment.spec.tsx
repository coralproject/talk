import { pureMerge } from "coral-common/utils";
import {
  createMutationResolverStub,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  toJSON,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import {
  GQLCOMMENT_STATUS,
  GQLResolver,
  MutationToApproveCommentResolver,
  MutationToRejectCommentResolver,
  QueryToCommentResolver,
} from "coral-framework/testHelpers/schema";

import create from "../create";
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
  const { testRenderer, context, subscriptionHandler } = create({
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
  return { testRenderer, context, subscriptionHandler };
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

it("renders single comment view", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: {
      Query: {
        comment: commentStub,
      },
    },
  });
  const { getByTestID } = within(testRenderer.root);
  const container = await waitForElement(() =>
    getByTestID("single-moderate-container")
  );
  expect(toJSON(container)).toMatchSnapshot();
});

it("approves single comment", async () => {
  const approveCommentStub = createMutationResolverStub<
    MutationToApproveCommentResolver
  >(({ variables }) => {
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
  });

  const { testRenderer } = await createTestRenderer({
    resolvers: {
      Query: {
        comment: commentStub,
      },
      Mutation: {
        approveComment: approveCommentStub,
      },
    },
  });

  const { getByLabelText, getByTestID } = within(testRenderer.root);
  const ApproveButton = await waitForElement(() => getByLabelText("Approve"));
  ApproveButton.props.onClick();

  expect(
    toJSON(getByTestID(`moderate-comment-${comment.id}`))
  ).toMatchSnapshot();

  expect(approveCommentStub.called).toBe(true);
});

it("rejects single comment", async () => {
  const rejectCommentStub = createMutationResolverStub<
    MutationToRejectCommentResolver
  >(({ variables }) => {
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
  });

  const { testRenderer } = await createTestRenderer({
    resolvers: {
      Query: {
        comment: commentStub,
      },
      Mutation: {
        rejectComment: rejectCommentStub,
      },
    },
  });

  const { getByLabelText, getByTestID } = within(testRenderer.root);
  const RejectButton = await waitForElement(() => getByLabelText("Reject"));
  RejectButton.props.onClick();

  expect(
    toJSON(getByTestID(`moderate-comment-${comment.id}`))
  ).toMatchSnapshot();
  expect(rejectCommentStub.called).toBe(true);
});
