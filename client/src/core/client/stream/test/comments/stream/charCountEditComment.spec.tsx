import sinon from "sinon";
import timekeeper from "timekeeper";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  findParentWithType,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import waitForRTE from "coral-stream/test/helpers/waitForRTE";

import { commenters, settings, stories } from "../../fixtures";
import create from "./create";

beforeAll(() => {
  timekeeper.freeze(stories[0].comments.edges[0].node.createdAt);
});
afterAll(() => {
  timekeeper.reset();
});

const settingsWithCharCount = {
  ...settings,
  charCount: {
    enabled: true,
    min: 3,
    max: 10,
  },
};

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns(settingsWithCharCount),
      viewer: sinon.stub().returns(commenters[0]),
      stream: sinon.stub().returns(stories[0]),
      ...resolver.Query,
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comment-comment-0")
  );

  // Open edit form.
  act(() => {
    within(comment).getByTestID("comment-edit-button").props.onClick();
  });

  // Wait for edit RTE to initialize.
  const rte = await waitForRTE(comment, "Edit comment");

  const form = findParentWithType(rte, "form")!;
  return {
    testRenderer,
    context,
    comment,
    rte,
    form,
  };
}

it("validate min", async () => {
  const { rte, form } = await createTestRenderer();

  const text = "Please enter at least 3 characters.";

  act(() => rte.props.onChange("ab"));
  act(() => {
    form.props.onSubmit();
  });
  within(form).getByText(text);
});

it("validate max", async () => {
  const { rte, form } = await createTestRenderer();

  const text = "Please enter at max 10 characters.";

  act(() => rte.props.onChange("abcdefghijklmnopqrst"));
  act(() => {
    form.props.onSubmit();
  });
  within(form).getByText(text);
});

it("show remaining characters", async () => {
  const { rte, form } = await createTestRenderer();

  act(() => rte.props.onChange("abc"));
  within(form).getByText("7 characters remaining");
  act(() => rte.props.onChange("abcdefghijkl"));
  within(form).getByText("-2 characters remaining");
});

it("update from server upon specific char count error", async () => {
  for (const errorCode of [
    ERROR_CODES.COMMENT_BODY_EXCEEDS_MAX_LENGTH,
    ERROR_CODES.COMMENT_BODY_TOO_SHORT,
  ]) {
    let createCommentCalled = false;
    const { rte, form } = await createTestRenderer(
      createResolversStub<GQLResolver>({
        Mutation: {
          editComment: () => {
            createCommentCalled = true;
            throw new InvalidRequestError({
              code: errorCode,
              param: "input.body",
              traceID: "traceID",
            });
          },
        },
        Query: {
          settings: () => {
            if (!createCommentCalled) {
              return settingsWithCharCount;
            }
            return {
              ...settingsWithCharCount,
              charCount: {
                enabled: true,
                min: 3,
                max: 5,
              },
            };
          },
        },
      }),
      { muteNetworkErrors: true }
    );

    act(() => rte.props.onChange("abc"));
    within(form).getByText("7 characters remaining");
    act(() => rte.props.onChange("abcdefgh"));
    within(form).getByText("2 characters remaining");
    act(() => {
      form.props.onSubmit();
    });
    await act(async () => {
      await waitForElement(() =>
        within(form).getByText("-3 characters remaining")
      );
    });
    // Body submit error should be displayed.
    within(form).getByText(errorCode);
    act(() => rte.props.onChange("abcde"));

    // Body submit error should disappear when form gets dirty.
    expect(within(form).queryByText(errorCode)).toBeNull();
  }
});
