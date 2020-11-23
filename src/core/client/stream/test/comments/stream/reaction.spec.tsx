import sinon from "sinon";

import { waitForElement, within } from "coral-framework/testHelpers";

import { commenters, settings, stories } from "../../fixtures";
import create from "./create";

function createTestRenderer() {
  const resolvers = {
    Query: {
      stream: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data).toEqual({
          id: stories[0].id,
          url: null,
          mode: null,
        });
        return stories[0];
      }),
      viewer: sinon.stub().returns(commenters[0]),
      settings: sinon.stub().returns(settings),
    },
    Mutation: {
      createCommentReaction: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data.input).toMatchObject({
          commentID: stories[0].comments.edges[0].node.id,
          commentRevisionID: stories[0].comments.edges[0].node.revision!.id,
        });
        return {
          comment: {
            id: stories[0].comments.edges[0].node.id,
            author: stories[0].comments.edges[0].node.author,
            revision: { id: stories[0].comments.edges[0].node.revision!.id },
            viewerActionPresence: { reaction: true },
            actionCounts: { reaction: { total: 1 } },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
      removeCommentReaction: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data.input).toMatchObject({
          commentID: stories[0].comments.edges[0].node.id,
        });
        return {
          comment: {
            id: stories[0].comments.edges[0].node.id,
            author: stories[0].comments.edges[0].node.author,
            revision: { id: stories[0].comments.edges[0].node.revision!.id },
            viewerActionPresence: { reaction: false },
            actionCounts: { reaction: { total: 0 } },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
    },
  };

  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });
  return { testRenderer, resolvers };
}

it("create and remove reaction", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer, resolvers } = createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );

  expect(comment.props.className).toContain("coral-reacted-0");
  const button = within(comment).getByTestID("comment-reaction-button");
  button.props.onClick({});

  expect(within(button).toJSON()).toMatchSnapshot("Respected");
  expect(resolvers.Mutation.createCommentReaction.called).toBe(true);
  expect(comment.props.className).toContain("coral-reacted-1");
  button.props.onClick({});

  expect(within(button).toJSON()).toMatchSnapshot("Unrespected");
  expect(resolvers.Mutation.removeCommentReaction.called).toBe(true);
  expect(comment.props.className).toContain("coral-reacted-0");
});
