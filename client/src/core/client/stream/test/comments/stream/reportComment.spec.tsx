import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import { ERROR_CODES } from "coral-common/common/lib/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import { commenters, settings, stories } from "../../fixtures";
import { createContext } from "./create";

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
      settings: sinon.stub().returns({ ...settings, dsa: { enabled: true } }),
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

  const { context } = createContext({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
      localRecord.setValue(true, "dsaFeaturesEnabled");
    },
  });
  customRenderAppWithContext(context);
  return { resolvers };
}

it("close popup", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  await createTestRenderer();
  const comment = await screen.findByTestId(`comment-${commentID}`);

  const reportButton = screen.getByRole("button", {
    name: "Report comment by Markus",
  });
  userEvent.click(reportButton);

  const form = within(comment).getByTestId("report-comment-form");
  const cancelButton = within(form).getByText("Cancel", { exact: false });
  userEvent.click(cancelButton);
});

it("report comment as offensive", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { resolvers } = await createTestRenderer();
  const comment = await screen.findByTestId(`comment-${commentID}`);

  const reportButton = screen.getByRole("button", {
    name: "Report comment by Markus",
  });
  userEvent.click(reportButton);

  const form = within(comment).getByTestId("report-comment-form");

  const radioButtonOffensive = within(form).getByLabelText(
    "This comment is offensive"
  );

  userEvent.click(radioButtonOffensive);

  const additionalInfo = within(form).getByTestId(
    "report-comment-additional-information"
  );
  userEvent.type(additionalInfo, "More info");

  const submitButton = within(form).getByRole("button", { name: "Submit" });

  await act(async () => {
    userEvent.click(submitButton);
  });
  within(comment).getByText("Thank you", { exact: false });
  within(comment).getByTestId("comment-reported-button");
  expect(resolvers.Mutation.createCommentFlag.called).toBe(true);
});

it("dont agree with comment", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  const { resolvers } = await createTestRenderer();
  const comment = await screen.findByTestId(`comment-${commentID}`);

  const reportButton = screen.getByRole("button", {
    name: "Report comment by Markus",
  });
  userEvent.click(reportButton);

  const form = within(comment).getByTestId("report-comment-form");

  const radioButtonOffensive = within(form).getByLabelText("I disagree", {
    exact: false,
  });

  userEvent.click(radioButtonOffensive);

  const additionalInfo = within(form).getByTestId(
    "report-comment-additional-information"
  );
  userEvent.type(additionalInfo, "More info");

  const submitButton = within(form).getByRole("button", { name: "Submit" });

  await act(async () => {
    userEvent.click(submitButton);
  });
  within(comment).getByText("Thank you", { exact: false });
  within(comment).getByTestId("comment-reported-button");
  expect(resolvers.Mutation.createCommentDontAgree.called).toBe(true);
});

it("report comment as offensive and handle server error", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  await createTestRenderer(
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
  const comment = await screen.findByTestId(`comment-${commentID}`);

  const reportButton = screen.getByRole("button", {
    name: "Report comment by Markus",
  });
  userEvent.click(reportButton);

  const form = within(comment).getByTestId("report-comment-form");

  const radioButtonOffensive = within(form).getByLabelText(
    "This comment is offensive"
  );

  userEvent.click(radioButtonOffensive);

  const submitButton = within(form).getByRole("button", { name: "Submit" });

  await act(async () => {
    userEvent.click(submitButton);
  });

  await within(form).findByText("INTERNAL_ERROR");
});

it("report comment includes link to report illegal content", async () => {
  const commentID = stories[0].comments.edges[0].node.id;
  await createTestRenderer();
  const comment = await screen.findByTestId(`comment-${commentID}`);
  const reportButton = screen.getByRole("button", {
    name: "Report comment by Markus",
  });
  userEvent.click(reportButton);
  const form = within(comment).getByTestId("report-comment-form");
  const reportIllegalContentButton = within(form).getByText(
    "Report illegal content"
  );
  expect(reportIllegalContentButton).toHaveAttribute(
    "href",
    "https://www.test.com/story-0?commentID=comment-0&view=illegalContentReport"
  );
});
