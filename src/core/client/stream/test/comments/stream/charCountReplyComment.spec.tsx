import RTE from "@coralproject/rte";
import sinon from "sinon";

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

import { commenters, settings, stories } from "../../fixtures";
import create from "./create";

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
}

it("validate min", async () => {
  const { rte, form } = await createTestRenderer();

  act(() => rte.props.onChange("ab"));

  expect(within(form).queryByText("Submit")?.props.disabled).toBeTruthy();

  act(() => rte.props.onChange("abcdefg"));
  expect(within(form).queryByText("Submit")?.props.disabled).toBeFalsy();
});

it("validate max", async () => {
  const { rte, form } = await createTestRenderer();

  act(() => rte.props.onChange("abcdefghijklmnopqrst"));
  expect(within(form).queryByText("Submit")?.props.disabled).toBeTruthy();

  act(() => rte.props.onChange(""));
  expect(within(form).queryByText("Submit")?.props.disabled).toBeTruthy();

  act(() => rte.props.onChange("abcdefg"));
  expect(within(form).queryByText("Submit")?.props.disabled).toBeFalsy();
});

it("show remaining characters", async () => {
  const { rte, form } = await createTestRenderer();

  act(() => rte.props.onChange("abc"));
  await waitForElement(() => within(form).getByText("7 characters remaining"));

  act(() => rte.props.onChange("abcdefghijkl"));
  await waitForElement(() => within(form).getByText("-2 characters remaining"));
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
          createCommentReply: () => {
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
    await waitForElement(() =>
      within(form).getByText("7 characters remaining")
    );

    act(() => rte.props.onChange("abcdefgh"));
    await waitForElement(() =>
      within(form).getByText("2 characters remaining")
    );

    await act(async () => form.props.onSubmit());
    await waitForElement(() =>
      within(form).getByText("-3 characters remaining")
    );
    // Body submit error should be displayed.
    await waitForElement(() => within(form).getByText(errorCode));

    act(() => rte.props.onChange("abcde"));

    // Body submit error should disappear when form gets dirty.
    expect(within(form).queryByText(errorCode)).toBeNull();
  }
});
