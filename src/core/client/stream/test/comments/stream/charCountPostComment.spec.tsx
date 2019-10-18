import RTE from "@coralproject/rte";
import sinon from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { GQLResolver } from "coral-framework/schema";
import {
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
      story: sinon.stub().returns(stories[0]),
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
    },
  });

  const rte = await waitForElement(
    () =>
      findParentWithType(
        within(testRenderer.root).getByLabelText("Post a comment"),
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
    rte,
    form,
  };
}

it("validate min", async () => {
  const { rte, form } = await createTestRenderer();

  const text = "Please enter at least 3 characters.";

  rte.props.onChange({ html: "ab" });
  form.props.onSubmit();
  within(form).getByText(text);

  // Reset validation when erasing all content.
  rte.props.onChange({ html: "" });
  expect(within(form).queryByText(text)).toBeNull();

  rte.props.onChange({ html: "ab" });
  expect(within(form).queryByText(text)).toBeNull();
});

it("validate max", async () => {
  const { rte, form } = await createTestRenderer();

  const text = "Please enter at max 10 characters.";

  rte.props.onChange({ html: "abcdefghijklmnopqrst" });
  form.props.onSubmit();
  within(form).getByText(text);

  // Reset validation when erasing all content.
  rte.props.onChange({ html: "" });
  expect(within(form).queryByText(text)).toBeNull();

  rte.props.onChange({ html: "abcdefghijklmnopqrst" });
  expect(within(form).queryByText(text)).toBeNull();
});

it("show remaining characters", async () => {
  const { rte, form } = await createTestRenderer();

  rte.props.onChange({ html: "abc" });
  within(form).getByText("7 characters remaining");
  rte.props.onChange({ html: "abcdefghijkl" });
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
          createComment: () => {
            createCommentCalled = true;
            throw new InvalidRequestError({
              code: errorCode,
              param: "input.body",
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

    rte.props.onChange({ html: "abc" });
    within(form).getByText("7 characters remaining");
    rte.props.onChange({ html: "abcdefgh" });
    within(form).getByText("2 characters remaining");
    form.props.onSubmit();
    await waitForElement(() =>
      within(form).getByText("-3 characters remaining")
    );
    // Body submit error should be displayed.
    within(form).getByText(errorCode);
    rte.props.onChange({ html: "abcde" });

    // Body submit error should disappear when form gets dirty.
    expect(within(form).queryByText(errorCode)).toBeNull();
  }
});
