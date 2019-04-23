import sinon from "sinon";
import timekeeper from "timekeeper";

import { ERROR_CODES } from "talk-common/errors";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "talk-framework/lib/errors";
import {
  createSinonStub,
  findParentWithType,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import RTE from "@coralproject/rte";
import { baseComment, commenters, settings, stories } from "../fixtures";
import create from "./create";

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns(settings),
      viewer: sinon.stub().returns(commenters[0]),
      story: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables.id).toBe(stories[0].id);
        return stories[0];
      }),
      ...resolver.Query,
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
      localRecord.setValue(true, "loggedIn");
    },
  });

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comment-comment-0")
  );

  // Open reply form.
  const replyButton = within(comment).getByText("Reply", {
    selector: "button",
  });

  replyButton.props.onClick();

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
    replyButton,
    rte,
    form,
  };
}

it("hides form when reclicking on the reply button", async () => {
  const { comment, replyButton } = await createTestRenderer();
  replyButton.props.onClick();
  expect(within(comment).queryByLabelText("Write a reply")).toBeNull();
});

it("post a reply", async () => {
  const { testRenderer, comment, rte, form } = await createTestRenderer({
    Mutation: {
      createCommentReply: sinon.stub().callsFake((_, data) => {
        expectAndFail(data).toMatchObject({
          input: {
            storyID: stories[0].id,
            parentID: stories[0].comments.edges[0].node.id,
            parentRevisionID: stories[0].comments.edges[0].node.revision.id,
            body: "<b>Hello world!</b>",
          },
        });
        return {
          edge: {
            cursor: "",
            node: {
              ...baseComment,
              id: "comment-x",
              author: commenters[0],
              body: "<b>Hello world! (from server)</b>",
            },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
    },
  });

  expect(within(comment).toJSON()).toMatchSnapshot("open reply form");

  // Write reply .
  rte.props.onChange({ html: "<b>Hello world!</b>" });

  timekeeper.freeze(new Date(baseComment.createdAt));
  form.props.onSubmit();

  const commentReplyList = within(testRenderer.root).getByTestID(
    "commentReplyList-comment-0"
  );

  // Test optimistic response.
  expect(within(commentReplyList).toJSON()).toMatchSnapshot(
    "optimistic response"
  );
  timekeeper.reset();

  // Test after server response.
  await waitForElement(() =>
    within(commentReplyList).getByText("(from server)", { exact: false })
  );
});

it("post a reply and handle non-visible comment state", async () => {
  const { comment, rte, form } = await createTestRenderer({
    Mutation: {
      createCommentReply: sinon.stub().callsFake((_, data) => {
        expectAndFail(data).toMatchObject({
          input: {
            storyID: stories[0].id,
            parentID: stories[0].comments.edges[0].node.id,
            parentRevisionID: stories[0].comments.edges[0].node.revision.id,
            body: "<b>Hello world!</b>",
          },
        });
        return {
          edge: {
            cursor: "",
            node: {
              ...baseComment,
              id: "comment-x",
              status: "SYSTEM_WITHHELD",
              author: commenters[0],
              body: "<b>Hello world!</b>",
            },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
    },
  });

  // Write reply .
  rte.props.onChange({ html: "<b>Hello world!</b>" });
  form.props.onSubmit();
  // Test after server response.
  await waitForElement(() =>
    within(comment).getByText("will be reviewed", { exact: false })
  );
  await within(comment)
    .getByText("Dismiss")
    .props.onClick();
  expect(
    within(comment).queryByText("will be reviewed", { exact: false })
  ).toBeNull();
});

it("post a reply and handle server error", async () => {
  const { rte, form, comment } = await createTestRenderer(
    {
      Mutation: {
        createCommentReply: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
        }),
      },
    },
    { muteNetworkErrors: true }
  );

  // Write reply .
  rte.props.onChange({ html: "<b>Hello world!</b>" });

  form.props.onSubmit();

  // Look for internal error being displayed.
  await waitForElement(() => within(comment).getByText("INTERNAL_ERROR"));
});

it("handle moderation nudge error", async () => {
  const { form, rte, comment } = await createTestRenderer(
    {
      Mutation: {
        createCommentReply: createSinonStub(
          s =>
            s.onFirstCall().callsFake((_, data) => {
              expectAndFail(data).toMatchObject({
                input: {
                  storyID: stories[0].id,
                  parentID: stories[0].comments.edges[0].node.id,
                  parentRevisionID:
                    stories[0].comments.edges[0].node.revision.id,
                  body: "<b>Hello world!</b>",
                  nudge: true,
                },
              });
              throw new ModerationNudgeError({
                code: ERROR_CODES.TOXIC_COMMENT,
              });
            }),
          s =>
            s.onSecondCall().callsFake((_, data) => {
              expectAndFail(data).toMatchObject({
                input: {
                  storyID: stories[0].id,
                  body: "<b>Hello world!</b>",
                  nudge: false,
                },
              });
              return {
                edge: {
                  cursor: "",
                  node: {
                    ...baseComment,
                    id: "comment-x",
                    status: "SYSTEM_WITHHELD",
                    author: commenters[0],
                    body: "<b>Hello world!</b>",
                  },
                },
                clientMutationId: data.input.clientMutationId,
              };
            })
        ),
      },
    },
    { muteNetworkErrors: true }
  );

  rte.props.onChange({ html: "<b>Hello world!</b>" });
  form.props.onSubmit();

  // Look for internal error being displayed.
  await waitForElement(() => within(form).getByText("TOXIC_COMMENT"));

  // Try again, now nudging should be disabled.
  form.props.onSubmit();

  // Comment should now go to moderation.
  await waitForElement(() =>
    within(comment).getByText("will be reviewed", { exact: false })
  );
});

it("handle disabled commenting error", async () => {
  let returnSettings = settings;
  const { rte, form } = await createTestRenderer(
    {
      Mutation: {
        createCommentReply: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({
            code: ERROR_CODES.COMMENTING_DISABLED,
          });
        }),
      },
      Query: {
        settings: sinon.stub().callsFake(() => returnSettings),
      },
    },
    { muteNetworkErrors: true }
  );

  rte.props.onChange({ html: "abc" });
  form.props.onSubmit();

  // Change the settings that we return to be closed.
  returnSettings = {
    ...settings,
    disableCommenting: {
      enabled: true,
      message: "commenting disabled",
    },
  };

  await waitForElement(() => within(form).getByText("commenting disabled"));
  expect(rte.props.disabled).toBe(true);
  expect(within(form).getByText("Submit").props.disabled).toBe(true);
});

it("handle story closed error", async () => {
  let returnStory = stories[0];
  const { rte, form } = await createTestRenderer(
    {
      Mutation: {
        createCommentReply: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({
            code: ERROR_CODES.STORY_CLOSED,
          });
        }),
      },
      Query: {
        story: sinon.stub().callsFake(() => returnStory),
      },
    },
    { muteNetworkErrors: true }
  );

  rte.props.onChange({ html: "abc" });
  form.props.onSubmit();

  // Change the story that we return to be closed.
  returnStory = { ...stories[0], isClosed: true };

  await waitForElement(() => within(form).getByText("Story is closed"));
  expect(rte.props.disabled).toBe(true);
  expect(within(form).getByText("Submit").props.disabled).toBe(true);
});
