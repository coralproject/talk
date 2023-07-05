import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  UserToCommentModerationActionHistoryResolver,
} from "coral-framework/schema";
import {
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import { moderationActions, settings, users } from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/configure/auth");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () =>
            pureMerge(viewer, {
              commentModerationActionHistory:
                createQueryResolverStub<UserToCommentModerationActionHistoryResolver>(
                  ({ variables }) => {
                    if (variables.first === 5) {
                      return {
                        edges: [
                          {
                            node: moderationActions[0],
                            cursor: moderationActions[0].createdAt,
                          },
                          {
                            node: moderationActions[1],
                            cursor: moderationActions[1].createdAt,
                          },
                        ],
                        pageInfo: {
                          endCursor: moderationActions[1].createdAt,
                          hasNextPage: true,
                        },
                      };
                    }
                    expectAndFail(variables).toEqual({
                      first: 10,
                      after: moderationActions[1].createdAt,
                    });
                    return {
                      edges: [
                        {
                          node: moderationActions[2],
                          cursor: moderationActions[2].createdAt,
                        },
                      ],
                      pageInfo: {
                        endCursor: moderationActions[2].createdAt,
                        hasNextPage: false,
                      },
                    };
                  }
                ),
            }),
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
}

it("renders decision history popover button", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const popover = await screen.findByTestId("decisionHistory-popover");
  const popoverButton = within(popover).getByTestId("decisionHistory-toggle");
  expect(popoverButton).toBeVisible();
  expect(
    within(popover).getByLabelText("A dialog showing the decision history")
  ).toBeVisible();
});

it("opens popover when clicked on button showing loading state", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const popoverButton = await screen.findByTestId("decisionHistory-toggle");
  expect(screen.queryByTestId("decisionHistory-loading-container")).toBeNull();
  expect(screen.queryByText("Your Decision History")).toBeNull();
  await act(async () => {
    userEvent.click(popoverButton);
  });
  expect(screen.getByText("Your Decision History")).toBeInTheDocument();
});

it("renders empty state when no moderation actions", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            commentModerationActionHistory:
              createQueryResolverStub<UserToCommentModerationActionHistoryResolver>(
                ({ variables }) => {
                  expectAndFail(variables).toEqual({
                    first: 5,
                  });
                  return {
                    edges: [],
                    pageInfo: {
                      hasNextPage: false,
                    },
                  };
                }
              ),
          }),
      },
    }),
  });
  const popoverButton = await screen.findByTestId("decisionHistory-toggle");
  userEvent.click(popoverButton);
  const decisionHistoryContainer = await screen.findByTestId(
    "decisionHistory-container"
  );
  expect(decisionHistoryContainer).toBeDefined();
  expect(screen.getByText("Your Decision History")).toBeDefined();
  expect(
    screen.getByText(
      "You will see a list of your post moderation actions here."
    )
  ).toBeDefined();
});

it("render popover content", async () => {
  await createTestRenderer();
  const popoverButton = await screen.findByTestId("decisionHistory-toggle");
  userEvent.click(popoverButton);

  const decisionHistoryContainer = await screen.findByTestId(
    "decisionHistory-container"
  );
  expect(decisionHistoryContainer).toBeDefined();
  expect(screen.getByText("Your Decision History")).toBeDefined();

  // Correctly renders approved comments
  const approvedCommentInfo = screen.getByText("Approved comment by");
  expect(approvedCommentInfo).toBeDefined();
  expect(approvedCommentInfo.textContent).toBe("Approved comment by addy");
  const goToCommentLinkApproved = screen.getAllByRole("link", {
    name: "Go to comment",
  })[0];
  expect(goToCommentLinkApproved).toBeDefined();
  expect(goToCommentLinkApproved).toHaveAttribute(
    "href",
    "/admin/moderate/comment/1b41be9f-510f-41f3-a1df-5a431dc98bf3"
  );
  expect(screen.getByText("2018-11-29T16:01:51.897Z")).toBeDefined();
  expect(screen.getByTestId("approved-icon")).toBeDefined();

  // Correctly renders rejected comments
  const rejectedCommentInfo = screen.getByText("Rejected comment by");
  expect(rejectedCommentInfo).toBeDefined();
  expect(rejectedCommentInfo.textContent).toBe("Rejected comment by addy");
  const goToCommentLinkRejected = screen.getAllByRole("link", {
    name: "Go to comment",
  })[1];
  expect(goToCommentLinkRejected).toBeDefined();
  expect(goToCommentLinkRejected).toHaveAttribute(
    "href",
    "/admin/moderate/comment/1b41be9f-510f-41f3-a1df-5a431dc98bf3"
  );
  expect(screen.getByText("2018-11-29T16:01:45.644Z")).toBeDefined();
  expect(screen.getByTestId("rejected-icon")).toBeDefined();

  // one dot divider should be rendered per decision history item
  expect(screen.getAllByTestId("decisionHistory-dotDivider")).toHaveLength(2);

  expect(screen.getByRole("button", { name: "Show More" })).toBeDefined();
});

it("loads more", async () => {
  await createTestRenderer();
  const popoverButton = await screen.findByTestId("decisionHistory-toggle");
  userEvent.click(popoverButton);

  // Wait for decision history to render.
  const decisionHistoryContainer = await screen.findByTestId(
    "decisionHistory-container"
  );

  // Find active show more button.
  const showMoreButton = within(decisionHistoryContainer).getByRole("button", {
    name: "Show More",
  });
  expect(showMoreButton).toBeEnabled();

  // Click show more!
  fireEvent.click(showMoreButton);

  // Disable show more while loading.
  expect(showMoreButton).toBeDisabled();

  // Wait until show more disappears.
  await waitFor(() => {
    expect(showMoreButton).not.toBeInTheDocument();
  });
});
