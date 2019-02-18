import sinon from "sinon";

import RTE from "@coralproject/rte";
import { ERROR_CODES } from "talk-common/errors";
import { InvalidRequestError } from "talk-framework/lib/errors";
import {
  createSinonStub,
  findParentWithType,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { settings, stories, users } from "../fixtures";
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
  resolver: any,
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns(settingsWithCharCount),
      me: sinon.stub().returns(users[0]),
      story: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: stories[0].id, url: null })
            .returns(stories[0])
      ),
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
  const { rte, form } = await createTestRenderer(
    {
      Mutation: {
        createComment: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
        }),
      },
    },
    { muteNetworkErrors: true }
  );

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
  const { rte, form } = await createTestRenderer(
    {
      Mutation: {
        createComment: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
        }),
      },
    },
    { muteNetworkErrors: true }
  );

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
  const { rte, form } = await createTestRenderer(
    {
      Mutation: {
        createComment: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
        }),
      },
    },
    { muteNetworkErrors: true }
  );

  rte.props.onChange({ html: "abc" });
  within(form).getByText("7 characters remaining");
  rte.props.onChange({ html: "abcdefghijkl" });
  within(form).getByText("-2 characters remaining");
});
