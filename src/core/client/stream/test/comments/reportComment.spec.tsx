import sinon from "sinon";

import { ERROR_CODES } from "talk-common/errors";
import { timeout } from "talk-common/utils";
import { InvalidRequestError } from "talk-framework/lib/errors";
import { wait, waitForElement, within } from "talk-framework/testHelpers";

import { settings, stories, users } from "../fixtures";
import create from "./create";

function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    Query: {
      story: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data).toEqual({
          id: stories[0].id,
          url: null,
        });
        return stories[0];
      }),
      me: sinon.stub().returns(users[0]),
      settings: sinon.stub().returns(settings),
      ...resolver.Query,
    },
    Mutation: {
      createCommentFlag: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data.input).toMatchObject({
          commentID: stories[0].comments.edges[0].node.id,
          commentRevisionID: stories[0].comments.edges[0].node.revision.id,
          reason: "COMMENT_REPORTED_OFFENSIVE",
          additionalDetails: "More info",
        });
        return {
          comment: {
            id: stories[0].comments.edges[0].node.id,
            myActionPresence: { flag: true },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
      createCommentDontAgree: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data.input).toMatchObject({
          commentID: stories[0].comments.edges[0].node.id,
          commentRevisionID: stories[0].comments.edges[0].node.revision.id,
          additionalDetails: "More info",
        });
        return {
          comment: {
            id: stories[0].comments.edges[0].node.id,
            myActionPresence: { dontAgree: true },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
      ...resolver.Mutation,
    },
  };

  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
      localRecord.setValue(true, "loggedIn");
    },
  });
  return { testRenderer, resolvers };
}

it("render popup", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer } = createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByText("Report", { selector: "button" });
  button.props.onClick();

  const popover = within(testRenderer.root).getByID(
    button.props["aria-controls"]
  );

  expect(within(popover).toJSON()).toMatchSnapshot();
});

it("close popup", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer } = createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByText("Report", { selector: "button" });
  button.props.onClick();

  const popover = within(testRenderer.root).getByID(
    button.props["aria-controls"]
  );

  // There is a once per frame click protection, so we wait a frame...
  await timeout();

  within(popover)
    .getByLabelText("Close Popover", { exact: false })
    .props.onClick({});
  expect(within(popover).toJSON()).toMatchSnapshot();
});

it("render popup expanded", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer } = createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByText("Report", { selector: "button" });
  button.props.onClick();

  const popover = within(testRenderer.root).getByID(
    button.props["aria-controls"]
  );

  const radioButton = within(popover).getByLabelText(
    "This comment is offensive"
  );

  radioButton.props.onChange({
    target: { type: "radio", value: radioButton.props.value },
  });

  expect(within(popover).toJSON()).toMatchSnapshot();
});

it("report comment as offensive", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer, resolvers } = createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByText("Report", { selector: "button" });
  button.props.onClick();

  const popover = within(testRenderer.root).getByID(
    button.props["aria-controls"]
  );

  const radioButton = within(popover).getByLabelText(
    "This comment is offensive"
  );

  radioButton.props.onChange({
    target: { type: "radio", value: radioButton.props.value },
  });

  within(popover)
    .getByLabelText("Please leave any additional information", { exact: false })
    .props.onChange({ target: { value: "More info" } });

  within(popover)
    .getByType("form")
    .props.onSubmit({});

  await waitForElement(() =>
    within(popover).getByText("Thank you", { exact: false })
  );
  expect(within(popover).toJSON()).toMatchSnapshot();

  const reportedButton = within(comment).getByText("Reported", {
    selector: "button",
  });
  expect(reportedButton.props.disabled).toBe(false);
  within(comment)
    .getByText("Dismiss")
    .props.onClick();
  expect(reportedButton.props.disabled).toBe(true);
  expect(resolvers.Mutation.createCommentFlag.called).toBe(true);
});

it("dont agree with comment", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer, resolvers } = createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByText("Report", { selector: "button" });
  button.props.onClick();

  const popover = within(testRenderer.root).getByID(
    button.props["aria-controls"]
  );

  const radioButton = within(popover).getByLabelText("I disagree", {
    exact: false,
  });

  radioButton.props.onChange({
    target: { type: "radio", value: radioButton.props.value },
  });

  within(popover)
    .getByLabelText("Please leave any additional information", { exact: false })
    .props.onChange({ target: { value: "More info" } });

  within(popover)
    .getByType("form")
    .props.onSubmit({});

  await waitForElement(() =>
    within(popover).getByText("Thank you", { exact: false })
  );

  within(popover)
    .getByText("Dismiss", { exact: false })
    .props.onClick({});

  await wait(() =>
    expect(
      within(popover).queryByText("Thank you", { exact: false })
    ).toBeNull()
  );

  const reportedButton = within(comment).getByText("Reported", {
    selector: "button",
  });
  expect(reportedButton.props.disabled).toBe(true);
  expect(resolvers.Mutation.createCommentDontAgree.called).toBe(true);
});

it("report comment as offensive and handle server error", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer } = createTestRenderer(
    {
      Mutation: {
        createCommentFlag: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
        }),
      },
    },
    { muteNetworkErrors: true }
  );
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByText("Report", { selector: "button" });
  button.props.onClick();

  const popover = within(testRenderer.root).getByID(
    button.props["aria-controls"]
  );

  const radioButton = within(popover).getByLabelText(
    "This comment is offensive"
  );

  radioButton.props.onChange({
    target: { type: "radio", value: radioButton.props.value },
  });

  within(popover)
    .getByType("form")
    .props.onSubmit({});

  // Look for internal error being displayed.
  await waitForElement(() => within(popover).getByText("INTERNAL_ERROR"));
});
