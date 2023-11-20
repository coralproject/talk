import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/common/lib/utils";
import {
  GQLDSAReportDecisionLegality,
  GQLDSAReportHistoryType,
  GQLDSAReportStatus,
  GQLResolver,
} from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import { dsaReports, settings, users } from "../fixtures";

const adminViewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/reports/report/dsa-report-1");
});

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => adminViewer,
          dsaReport: () => dsaReports[0],
        },
        Mutation: {
          addDSAReportNote: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              body: "This is an initial update that I am looking into this report",
              reportID: "dsa-report-1",
              userID: "user-admin-0",
            });
            const dsaReportUpdated = pureMerge(dsaReports[0], {
              history: [
                {
                  id: "history-1",
                  type: GQLDSAReportHistoryType.NOTE,
                  createdAt: "2023-07-07T18:24:00.000Z",
                  body: "This is an initial update that I am looking into this report",
                  createdBy: users.admins[0],
                },
              ],
            });
            return {
              dsaReport: dsaReportUpdated,
            };
          },
          changeDSAReportStatus: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              status: GQLDSAReportStatus.UNDER_REVIEW,
              reportID: "dsa-report-1",
              userID: "user-admin-0",
            });
            const dsaReportUpdated = pureMerge(dsaReports[0], {
              status: "UNDER_REVIEW",
              history: [
                {
                  id: "history-2",
                  type: GQLDSAReportHistoryType.STATUS_CHANGED,
                  createdAt: "2023-07-07T18:24:00.000Z",
                  status: GQLDSAReportStatus.UNDER_REVIEW,
                  createdBy: users.admins[0],
                },
              ],
            });
            return {
              dsaReport: dsaReportUpdated,
            };
          },
          makeDSAReportDecision: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              reportID: "dsa-report-1",
              userID: "user-admin-0",
              legality: GQLDSAReportDecisionLegality.ILLEGAL,
              legalGrounds: "Legal grounds for illegal content",
              detailedExplanation: "Explanation of why is illegal content",
              commentID: dsaReports[0].comment?.id,
              commentRevisionID: dsaReports[0].comment?.revision?.id,
            });
            const dsaReportUpdated = pureMerge(dsaReports[0], {
              status: GQLDSAReportStatus.COMPLETED,
              decision: {
                legality: GQLDSAReportDecisionLegality.ILLEGAL,
                legalGrounds: "Legal grounds for illegal content",
                detailedExplanation: "Explanation of why is illegal content",
              },
              history: [
                {
                  id: "history-3",
                  type: GQLDSAReportHistoryType.DECISION_MADE,
                  createdAt: "2023-07-07T18:24:00.000Z",
                  createdBy: users.admins[0],
                  decision: {
                    legality: GQLDSAReportDecisionLegality.ILLEGAL,
                    legalGrounds: "Legal grounds for illegal content",
                    detailedExplanation:
                      "Explanation of why is illegal content",
                  },
                },
              ],
            });
            return {
              dsaReport: dsaReportUpdated,
            };
          },
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  customRenderAppWithContext(context);

  const container = await screen.findByTestId("single-report-route");
  return { container };
};

it("includes expected information about dsa report", async () => {
  const { container } = await createTestRenderer();

  const allDSAReportsButton = within(container).getByRole("link", {
    name: "All DSA Reports",
  });
  expect(allDSAReportsButton).toHaveProperty(
    "href",
    "http://localhost/admin/reports"
  );

  expect(
    within(container).getByRole("button", { name: "Awaiting review" })
  ).toBeVisible();

  expect(within(container).getByText("What law was broken?")).toBeVisible();
  expect(
    within(container).getByText("The law that is alleged to be broken")
  ).toBeVisible();

  expect(within(container).getByText("Explanation")).toBeVisible();
  expect(
    within(container).getByText(
      "The additional information supporting why that law is alleged to have been broken"
    )
  ).toBeVisible();

  expect(
    within(container).getByRole("link", { name: "View comment in stream" })
  ).toHaveProperty(
    "href",
    "http://localhost/admin/reports/report/dsa-report-1?commentID=comment-regular-0"
  );

  expect(
    within(container).getByRole("link", { name: "View comment in moderation" })
  ).toHaveProperty(
    "href",
    "http://localhost/admin/moderate/comment/comment-regular-0"
  );

  expect(
    within(container).getByText("Illegal content report submitted")
  ).toBeVisible();
});

it("can add notes to a report", async () => {
  const { container } = await createTestRenderer();

  // Add a note and see that it is then displayed in the report history
  const addNoteTextbox =
    within(container).getByPlaceholderText("Add your note...");
  userEvent.type(
    addNoteTextbox,
    "This is an initial update that I am looking into this report"
  );
  const addUpdateButton = within(container).getByRole("button", {
    name: "Add update",
  });
  userEvent.click(addUpdateButton);
  expect(
    await within(container).findByText("Markus added a note")
  ).toBeVisible();
});

it("change status of a report", async () => {
  const { container } = await createTestRenderer();

  // change status
  const changeStatus = within(container).getByRole("button", {
    name: "Awaiting review",
  });
  userEvent.click(changeStatus);

  const statusPopover = screen.getByRole("dialog");

  const inReviewButton = within(statusPopover).getByText("In review");

  fireEvent.click(inReviewButton);

  expect(
    await within(container).findByText("Markus changed status to In review")
  ).toBeVisible();
});

it("can make a legality decision on a report", async () => {
  const { container } = await createTestRenderer();

  // make report decision
  const makeDecisionButton = within(container).getByRole("button", {
    name: "Decision",
  });
  userEvent.click(makeDecisionButton);
  const makeDecisionModal = await screen.findByTestId(
    "report-makeDecisionModal"
  );
  const yesButton = within(makeDecisionModal).getByRole("button", {
    name: "Yes",
  });
  userEvent.click(yesButton);
  const submitButton = within(makeDecisionModal).getByRole("button", {
    name: "Submit",
  });
  expect(submitButton).toBeDisabled();
  const legalGroundsTextbox =
    within(makeDecisionModal).getByPlaceholderText("Add law...");
  userEvent.type(legalGroundsTextbox, "Legal grounds for illegal content");
  expect(submitButton).toBeDisabled();
  const explanationTextbox =
    within(makeDecisionModal).getByPlaceholderText("Add explanation...");
  userEvent.type(explanationTextbox, "Explanation of why is illegal content");
  expect(submitButton).toBeEnabled();
  userEvent.click(submitButton);
  expect(
    await within(container).findByText(
      "Markus made a decision that this report contains illegal content"
    )
  );
});
