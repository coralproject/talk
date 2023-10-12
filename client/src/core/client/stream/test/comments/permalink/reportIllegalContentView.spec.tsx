import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import {
  createSinonStub,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import {
  commenters,
  comments,
  commentWithReplies,
  settings,
  stories,
} from "../../fixtures";
import create from "./create";

const createTestRenderer = async () => {
  const commentStub = {
    ...commentWithReplies,
    parentCount: 2,
    parents: {
      pageInfo: {
        hasPreviousPage: false,
      },
      edges: [
        {
          node: comments[1],
          cursor: comments[1].createdAt,
        },
        {
          node: comments[2],
          cursor: comments[2].createdAt,
        },
      ],
    },
  };

  const storyStub = {
    ...stories[0],
    comments: {
      pageInfo: {
        hasNextPage: false,
      },
      edges: [
        {
          node: commentStub,
          cursor: commentStub.createdAt,
        },
      ],
    },
  };

  const resolvers = {
    Query: {
      comment: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s.withArgs(undefined, { id: commentStub.id }).returns(commentStub)
      ),
      story: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: storyStub.id, url: null })
            .returns(storyStub)
      ),
      viewer: sinon.stub().returns(commenters[0]),
      settings: sinon.stub().returns(settings),
    },
    Mutation: {
      createDSAReport: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data.input).toMatchObject({
          commentID: "comment-with-replies",
          userID: "user-0",
          lawBrokenDescription: "a law",
          additionalInformation: "more info",
          submissionID: "uuid-1",
          clientMutationId: "0",
        });
        return {
          dsaReport: {
            id: "report-id",
            lawBrokenDescription: "a law",
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
    },
  };

  const { context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(storyStub.id, "storyID");
      localRecord.setValue(commentStub.id, "commentID");
    },
  });
  customRenderAppWithContext(context);
};

beforeEach(async () => {
  replaceHistoryLocation(
    "http://localhost/?commentID=comment-with-replies&view=illegalContentReport"
  );
});

it("includes and submits report illegal content form", async () => {
  await createTestRenderer();
  await screen.findByText("Report illegal content");
  const currentTab = screen.getByTestId("current-tab-pane");

  expect(
    within(currentTab).getByRole("link", { name: "Back to comments" })
  ).toBeVisible();

  const lawBrokenTextbox = within(currentTab).getByRole("textbox", {
    name: "What law do you believe has been broken? (required)",
  });
  userEvent.type(lawBrokenTextbox, "a law");

  const submitReportButton = within(currentTab).getByRole("button", {
    name: "Submit report",
  });
  expect(submitReportButton).toBeDisabled();

  const additionalInfo = within(currentTab).getByTestId("additionalInfo");
  userEvent.type(additionalInfo, "more info");
  const bonafideBelief = within(currentTab).getByRole("checkbox", {
    name: "Bonafide belief statement",
  });
  userEvent.click(bonafideBelief);

  expect(submitReportButton).toBeEnabled();

  await act(async () => {
    userEvent.click(submitReportButton);
  });
});
