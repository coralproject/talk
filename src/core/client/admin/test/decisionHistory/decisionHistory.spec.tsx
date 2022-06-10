import { fireEvent, screen, waitFor, within } from "@testing-library/react";
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
              commentModerationActionHistory: createQueryResolverStub<
                UserToCommentModerationActionHistoryResolver
              >(({ variables }) => {
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
              }),
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
  await createTestRenderer();
  const popover = await screen.findByTestId("decisionHistory-popover");
  const popoverButton = within(popover).getByTestId("decisionHistory-toggle");
  expect(popoverButton).toBeDefined();
  expect(
    within(popover).getByLabelText("A dialog showing the decision history")
  ).toBeDefined();
});

it("opens popover when clicked on button showing loading state", async () => {
  await createTestRenderer();
  const popoverButton = await screen.findByTestId("decisionHistory-toggle");
  expect(
    screen.queryByTestId("decisionHistory-loading-container")
  ).not.toBeInTheDocument();
  expect(screen.queryByText("Your Decision History")).not.toBeInTheDocument();
  userEvent.click(popoverButton);
  expect(screen.getByTestId("decisionHistory-loading-container")).toBeDefined();
  expect(screen.getByText("Your Decision History")).toBeDefined();
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
  expect(screen.getByText("Approved comment by")).toBeDefined();
  expect(screen.getByText("Rejected comment by")).toBeDefined();
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
  waitFor(() => {
    expect(showMoreButton).not.toBeInTheDocument();
  });
});
