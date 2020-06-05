import sinon from "sinon";
import timekeeper from "timekeeper";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  act,
  createSinonStub,
  waitForElement,
  within
} from "coral-framework/testHelpers";

import {
  commenters,
  commentWithReplies,
  settings,
  storyWithReplies
} from "../../fixtures";
import create from "./create";

function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean; status?: string } = {}
) {
  const resolvers = {
    Query: {
      stream: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: storyWithReplies.id, url: null })
            .returns(storyWithReplies)
      ),
      viewer: sinon.stub().returns(commenters[0]),
      settings: sinon.stub().returns(settings)
    },
    Mutation: {
      editComment: sinon.stub().callsFake((_, data) => {
        expectAndFail(data).toMatchObject({
          input: {
            commentID: commentWithReplies.id,
            body: "Edited!"
          }
        });

        return {
          // TODO: add a type assertion here to ensure that if the type changes, that the test will fail
          comment: {
            id: commentWithReplies.id,
            body: "Edited! (from server)",
            status: options.status ? options.status : commentWithReplies.status,
            editing: {
              edited: true
            },
            revision: {
              id: commentWithReplies.revision!.id
            }
          },
          clientMutationId: data.input.clientMutationId
        };
      })
    },
    ...resolver
  };

  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(storyWithReplies.id, "storyID");
    }
  });
  return testRenderer;
}

beforeEach(() => {
  timekeeper.freeze(commentWithReplies.createdAt);
});

afterEach(() => {
  timekeeper.reset();
});

it("edit a comment", async () => {
  const testRenderer = createTestRenderer();

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentWithReplies.id}`)
  );
  expect(within(comment).toJSON()).toMatchSnapshot(
    "render comment with edit button"
  );

  // Open edit form.
  act(() =>
    within(comment)
      .getByTestID("comment-edit-button")
      .props.onClick()
  );
  expect(within(comment).toJSON()).toMatchSnapshot("edit form");
  expect(await within(comment).axe()).toHaveNoViolations();

  act(() =>
    testRenderer.root
      .findByProps({
        inputId: `comments-editCommentForm-rte-${commentWithReplies.id}`
      })
      .props.onChange({ html: "Edited!" })
  );

  act(() => {
    within(comment)
      .getByType("form")
      .props.onSubmit();
  });

  // Test optimistic response.
  expect(within(comment).toJSON()).toMatchSnapshot("optimistic response");

  // Wait for server response.
  await act(async () => {
    await waitForElement(() =>
      within(comment).getByText("Edited! (from server)")
    );
  });

  // Test after server response.
  expect(within(comment).toJSON()).toMatchSnapshot("server response");
});

it("edit a comment and handle non-published comment state", async () => {
  const testRenderer = createTestRenderer({}, { status: "SYSTEM_WITHHELD" });

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentWithReplies.id}`)
  );

  // Open edit form.
  act(() =>
    within(comment)
      .getByTestID("comment-edit-button")
      .props.onClick()
  );

  act(() =>
    testRenderer.root
      .findByProps({
        inputId: `comments-editCommentForm-rte-${commentWithReplies.id}`
      })
      .props.onChange({ html: "Edited!" })
  );

  act(() => {
    within(comment)
      .getByType("form")
      .props.onSubmit();
  });

  // Test after server response.
  await waitForElement(() =>
    within(comment).getByText("will be reviewed", { exact: false })
  );
  within(comment)
    .getByTestID("callout-close-button")
    .props.onClick();
  expect(
    within(testRenderer.root).queryByText("will be reviewed", { exact: false })
  ).toBeNull();

  // The comment must disappear.
  expect(
    within(testRenderer.root).queryByTestID(`comment-${commentWithReplies.id}`)
  ).toBeNull();

  // The whole reply list must disappear too.
  expect(
    within(
      within(testRenderer.root).getByTestID(
        `commentReplyList-${commentWithReplies.id}`
      )
    ).queryAllByTestID(/^comment-.*$/).length
  ).toBe(0);
});

it("cancel edit", async () => {
  const testRenderer = createTestRenderer();

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentWithReplies.id}`)
  );

  // Open edit form.
  act(() =>
    within(comment)
      .getByTestID("comment-edit-button")
      .props.onClick()
  );

  // Cancel edit form.
  act(() =>
    within(comment)
      .getByText("Cancel")
      .props.onClick()
  );

  expect(within(comment).toJSON()).toMatchSnapshot();
});

it("shows expiry message", async () => {
  const testRenderer = createTestRenderer();

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentWithReplies.id}`)
  );

  jest.useFakeTimers();

  // Open edit form.
  act(() =>
    within(comment)
      .getByTestID("comment-edit-button")
      .props.onClick()
  );

  timekeeper.reset();
  jest.runOnlyPendingTimers();

  // Show edit time expired.
  expect(within(comment).toJSON()).toMatchSnapshot("edit time expired");

  // Close edit form.
  act(() =>
    within(comment)
      .getByText("Close")
      .props.onClick()
  );
  expect(within(comment).toJSON()).toMatchSnapshot("edit form closed");
});

it("edit a comment and handle server error", async () => {
  const testRenderer = createTestRenderer(
    {
      Mutation: {
        editComment: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
        })
      }
    },
    { muteNetworkErrors: true }
  );

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentWithReplies.id}`)
  );

  // Open edit form.
  act(() =>
    within(comment)
      .getByTestID("comment-edit-button")
      .props.onClick()
  );
  expect(within(comment).toJSON()).toMatchSnapshot("edit form");

  act(() =>
    testRenderer.root
      .findByProps({
        inputId: `comments-editCommentForm-rte-${commentWithReplies.id}`
      })
      .props.onChange({ html: "Edited!" })
  );

  act(() => {
    within(comment)
      .getByType("form")
      .props.onSubmit();
  });

  // Look for internal error being displayed.
  await act(async () => {
    await waitForElement(() => within(comment).getByText("INTERNAL_ERROR"));
  });
});
