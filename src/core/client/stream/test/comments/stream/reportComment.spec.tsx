import sinon from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { act, waitForElement, within } from "coral-framework/testHelpers";

import { commenters, settings, stories } from "../../fixtures";
import create from "./create";

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) {
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
      ...resolver.Query,
    },
    Mutation: {
      createCommentFlag: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data.input).toMatchObject({
          commentID: stories[0].comments.edges[0].node.id,
          commentRevisionID: stories[0].comments.edges[0].node.revision!.id,
          reason: "COMMENT_REPORTED_OFFENSIVE",
          additionalDetails: "More info",
        });
        return {
          comment: {
            id: stories[0].comments.edges[0].node.id,
            viewerActionPresence: { flag: true },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
      createCommentDontAgree: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data.input).toMatchObject({
          commentID: stories[0].comments.edges[0].node.id,
          commentRevisionID: stories[0].comments.edges[0].node.revision!.id,
          additionalDetails: "More info",
        });
        return {
          comment: {
            id: stories[0].comments.edges[0].node.id,
            viewerActionPresence: { dontAgree: true },
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
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });
  return { testRenderer, resolvers };
}

it("render popup", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer } = await createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByTestID("comment-report-button");
  act(() => button.props.onClick());

  const form = within(testRenderer.root).getByTestID("report-comment-form");

  expect(within(form).toJSON()).toMatchSnapshot();
});

it("close popup", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer } = await createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByTestID("comment-report-button");
  act(() => button.props.onClick());

  const form = within(comment).getByTestID("report-comment-form");
  act(() =>
    within(form).getByText("Cancel", { exact: false }).props.onClick({})
  );
});

it("render popup expanded", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer } = await createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByTestID("comment-report-button");
  act(() => button.props.onClick());

  const popover = within(testRenderer.root).getByTestID("report-comment-form");

  const radioButton = within(popover).getByLabelText(
    "This comment is offensive"
  );

  act(() =>
    radioButton.props.onChange({
      target: { type: "radio", value: radioButton.props.value },
    })
  );

  expect(within(popover).toJSON()).toMatchSnapshot();
});

it("report comment as offensive", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer, resolvers } = await createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByTestID("comment-report-button");
  act(() => button.props.onClick());

  const form = within(comment).getByTestID("report-comment-form");

  const radioButton = within(form).getByLabelText("This comment is offensive");

  act(() =>
    radioButton.props.onChange({
      target: { type: "radio", value: radioButton.props.value },
    })
  );

  act(() =>
    within(form)
      .getByTestID("report-comment-additional-information")
      .props.onChange({ target: { value: "More info" } })
  );

  act(() => {
    within(form).getByType("form").props.onSubmit({});
  });

  await act(async () => {
    await waitForElement(() =>
      within(comment).getByText("Thank you", { exact: false })
    );
  });
  expect(within(comment).toJSON()).toMatchSnapshot();
  within(comment).getByTestID("comment-reported-button");
  expect(resolvers.Mutation.createCommentFlag.called).toBe(true);
});

it("dont agree with comment", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer, resolvers } = await createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByTestID("comment-report-button");
  act(() => button.props.onClick());

  const form = within(comment).getByTestID("report-comment-form");

  const radioButton = within(form).getByLabelText("I disagree", {
    exact: false,
  });

  act(() =>
    radioButton.props.onChange({
      target: { type: "radio", value: radioButton.props.value },
    })
  );

  act(() =>
    within(form)
      .getByTestID("report-comment-additional-information")
      .props.onChange({ target: { value: "More info" } })
  );

  act(() => {
    within(form).getByType("form").props.onSubmit({});
  });

  await act(async () => {
    await waitForElement(() =>
      within(comment).getByText("Thank you", { exact: false })
    );
  });

  within(comment).getByTestID("comment-reported-button");
  expect(resolvers.Mutation.createCommentDontAgree.called).toBe(true);
});

it("report comment as offensive and handle server error", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { testRenderer } = await createTestRenderer(
    {
      Mutation: {
        createCommentFlag: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({
            code: ERROR_CODES.INTERNAL_ERROR,
            traceID: "traceID",
          });
        }),
      },
    },
    { muteNetworkErrors: true }
  );
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentID}`)
  );
  const button = within(comment).getByTestID("comment-report-button");
  act(() => button.props.onClick());

  const form = within(comment).getByTestID("report-comment-form");

  const radioButton = within(form).getByLabelText("This comment is offensive");

  act(() =>
    radioButton.props.onChange({
      target: { type: "radio", value: radioButton.props.value },
    })
  );

  act(() => {
    within(form).getByType("form").props.onSubmit({});
  });

  // Look for internal error being displayed.
  await act(async () => {
    await waitForElement(() => within(form).getByText("INTERNAL_ERROR"));
  });
});
