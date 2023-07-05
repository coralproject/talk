import RTE from "@coralproject/rte";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  findParentWithType,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import {
  baseComment,
  commenters,
  comments,
  settings,
  stories,
} from "../../fixtures";
import create from "./create";

const commentFixture = comments[0];

const storyFixture = {
  ...stories[0],
  comments: {
    pageInfo: {
      hasNextPage: false,
    },
    edges: [
      {
        node: commentFixture,
        cursor: commentFixture.createdAt,
      },
    ],
  },
};

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => commenters[0],
          comment: ({ variables }) => {
            expectAndFail(variables.id).toBe(commentFixture.id);
            return commentFixture;
          },
          story: ({ variables }) => {
            expectAndFail(variables.id).toBe(storyFixture.id);
            return storyFixture;
          },
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(storyFixture.id, "storyID");
      localRecord.setValue(commentFixture.id, "commentID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comment-comment-0")
  );

  // Open reply form.
  act(() =>
    within(comment).getByTestID("comment-reply-button").props.onClick()
  );

  const rte = await waitForElement(
    () =>
      findParentWithType(
        within(comment).getByLabelText("Write a reply"),
        // We'll use the RTE component here as an exception because the
        // jsdom does not support all of what is needed for rendering the
        // Rich Text Editor.
        RTE
      )!
  );

  const form = findParentWithType(rte, "form")!;
  return {
    testRenderer,
    context,
    comment,
    rte,
    form,
  };
};

it("post a reply", async () => {
  const { testRenderer, rte, form } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        createCommentReply: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            storyID: storyFixture.id,
            parentID: storyFixture.comments.edges[0].node.id,
            parentRevisionID: storyFixture.comments.edges[0].node.revision!.id,
            body: "<b>Hello world!</b>",
          });
          return {
            edge: {
              cursor: "",
              node: {
                ...baseComment,
                id: "comment-x",
                author: commenters[0],
                body: "<b>Hello world! (from server)</b>",
                parent: storyFixture.comments.edges[0].node,
              },
            },
          };
        },
      },
    }),
  });

  await act(async () => {
    expect(await within(form).axe()).toHaveNoViolations();
  });

  // Write reply .
  act(() => rte.props.onChange("<b>Hello world!</b>"));
  act(() => {
    form.props.onSubmit();
  });

  const commentReplyList = within(testRenderer.root).getByTestID(
    "commentReplyList-comment-0"
  );

  // Test after server response.
  await act(async () => {
    await waitForElement(() =>
      within(commentReplyList).getByText("(from server)", { exact: false })
    );
  });
});
