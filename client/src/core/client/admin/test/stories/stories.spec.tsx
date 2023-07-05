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
  GQLSTORY_STATUS,
  MutationToCloseStoryResolver,
  MutationToOpenStoryResolver,
} from "coral-framework/schema";
import {
  createMutationResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  TransitionControlData,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import {
  emptyStories,
  settings,
  settingsWithMultisite,
  site,
  siteConnection,
  sites,
  stories,
  storyConnection,
  users,
} from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/stories");
});

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          site: () => site,
          sites: () => siteConnection,
          stories: ({ variables }) => {
            expectAndFail(variables.status).toBeFalsy();
            return storyConnection;
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
  return { context };
}

it("renders stories", async () => {
  await act(async () => {
    await createTestRenderer();
  });

  const container = await screen.findByTestId("stories-container");

  expect(
    within(container).getByRole("row", {
      name: "Finally a Cure for Cancer Vin Hoa 11/29/2018, 4:01 PM 3 2 5 Open",
    })
  ).toBeVisible();
  expect(
    within(container).getByRole("row", {
      name: "First Colony on Mars Linh Nguyen 11/29/2018, 4:01 PM 3 2 5 Open",
    })
  ).toBeVisible();
});

it("renders empty stories", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          stories: () => emptyStories,
        },
      }),
    });
  });
  const container = await screen.findByTestId("stories-container");

  // renders only the row of table headings
  expect(within(container).getAllByRole("row").length).toEqual(1);
  expect(
    within(container).getByText("There are currently no published stories.")
  ).toBeVisible();
});

it("goes to moderation when clicking on title", async () => {
  let transitionControlData: TransitionControlData;
  await act(async () => {
    const {
      context: { transitionControl },
    } = await createTestRenderer();
    transitionControlData = transitionControl;
  });
  const container = await screen.findByTestId("stories-container");

  // Prevent router transitions.
  transitionControlData!.allowTransition = false;

  const story = storyConnection.edges[0].node;
  const storyLink = within(container).getByRole("link", {
    name: "Finally a Cure for Cancer",
  });
  userEvent.click(storyLink);

  await waitFor(() => {
    expect(transitionControlData!.history[0].pathname).toBe(
      `/admin/moderate/stories/${story.id}`
    );
  });
});

it("filter by status", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          stories: ({ variables, callCount }) => {
            switch (callCount) {
              case 0:
                return storyConnection;
              default:
                expectAndFail(variables.status).toBe(GQLSTORY_STATUS.CLOSED);
                return emptyStories;
            }
          },
        },
      }),
    });
  });
  const container = await screen.findByTestId("stories-container");

  const selectField = within(container).getByRole("combobox", {
    name: "Search by status",
  });
  userEvent.selectOptions(selectField, "CLOSED");

  expect(
    await within(container).findByText(
      "We could not find any stories matching your criteria."
    )
  ).toBeVisible();
});

it("change story status", async () => {
  const story = stories[1];
  const openStory = createMutationResolverStub<MutationToOpenStoryResolver>(
    ({ variables }) => {
      expectAndFail(variables).toMatchObject({
        id: story.id,
      });
      const storyRecord = pureMerge(story, {
        status: GQLSTORY_STATUS.OPEN,
        createdAt: false,
        isClosed: false,
      });
      return {
        story: storyRecord,
      };
    }
  );

  const closeStory = createMutationResolverStub<MutationToCloseStoryResolver>(
    ({ variables }) => {
      expectAndFail(variables).toMatchObject({
        id: story.id,
      });
      const storyRecord = pureMerge(story, {
        status: GQLSTORY_STATUS.CLOSED,
        createdAt: "2018-11-29T16:01:51.897Z",
        isClosed: true,
      });
      return {
        story: storyRecord,
      };
    }
  );

  await act(async () => {
    await createTestRenderer({
      resolvers: {
        Mutation: { openStory, closeStory },
        Query: {
          story: () => story,
        },
      },
    });
  });
  const container = await screen.findByTestId("stories-container");

  const storyRow = within(container).getByRole("row", {
    name: "First Colony on Mars Linh Nguyen 11/29/2018, 4:01 PM 3 2 5 Open",
  });
  const openStoryDrawerButton = within(storyRow).getByRole("button", {
    name: "Open Info Drawer",
  });
  userEvent.click(openStoryDrawerButton);

  const modal = await screen.findByTestId("modal-storyInfoDrawer");
  const changeStatusButton = await within(modal).findByLabelText(
    "Select action"
  );
  userEvent.click(changeStatusButton);

  /** CLOSE STORY */
  fireEvent.click(within(modal).getByRole("button", { name: "Closed" }));
  expect(closeStory.called).toBe(true);

  /** OPEN STORY */
  userEvent.click(changeStatusButton);
  fireEvent.click(within(modal).getByRole("button", { name: "Open" }));
  expect(openStory.called).toBe(true);
});

it("load more", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          stories: ({ callCount }) => {
            switch (callCount) {
              case 0:
                return {
                  edges: [
                    { node: stories[0], cursor: stories[0].createdAt },
                    { node: stories[1], cursor: stories[1].createdAt },
                  ],
                  pageInfo: {
                    endCursor: stories[1].createdAt,
                    hasNextPage: true,
                  },
                };
              default:
                return {
                  edges: [{ node: stories[2], cursor: stories[2].createdAt }],
                  pageInfo: {
                    endCursor: stories[2].createdAt,
                    hasNextPage: false,
                  },
                };
            }
          },
        },
      }),
    });
  });
  const container = await screen.findByTestId("stories-container");

  const loadMore = within(container).getByText("Load More");
  userEvent.click(loadMore);
  await waitFor(() => {
    expect(within(container).queryByText("Load More")).not.toBeInTheDocument();
  });

  expect(
    within(container).getByRole("row", {
      name: "World hunger has been defeated 11/29/2018, 4:01 PM 3 2 5 Closed",
    })
  ).toBeVisible();
});

it("filter by search", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          stories: ({ variables, callCount }) => {
            switch (callCount) {
              case 0:
                return storyConnection;
              default:
                expectAndFail(variables.query).toBe("search");
                return emptyStories;
            }
          },
        },
      }),
    });
  });
  const container = await screen.findByTestId("stories-container");

  const searchField = within(container).getByRole("textbox", {
    name: "Search by story title or author",
  });
  userEvent.type(searchField, "search");
  userEvent.click(within(container).getByRole("button", { name: "Search" }));
  expect(
    await within(container).findByText(
      "We could not find any stories matching your criteria."
    )
  ).toBeVisible();
});

it("search by site name", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          settings: () => settingsWithMultisite,
          sites: ({ variables, callCount }) => {
            switch (callCount) {
              case 0:
                expectAndFail(variables.query).toBe("Test");
                return {
                  edges: [{ node: sites[0], cursor: sites[0].createdAt }],
                  pageInfo: { endCursor: null, hasNextPage: false },
                };
              case 1:
                expectAndFail(variables.query).toBe("Not a site");
                return {
                  edges: [],
                  pageInfo: { endCursor: null, hasNextPage: false },
                };
              default:
                return siteConnection;
            }
          },
        },
      }),
    });
  });
  const container = await screen.findByTestId("stories-container");

  const siteSearchField = within(container).getByRole("textbox", {
    name: "Search by site name",
  });

  userEvent.type(siteSearchField, "Test");
  const siteSearchButton = within(container).getByTestId("site-search-button");
  userEvent.click(siteSearchButton);
  const testSite = await within(container).findByText("Test Site");
  userEvent.click(testSite);
  await waitFor(() => {
    expect(siteSearchField).toHaveValue("Test Site");
  });

  userEvent.clear(siteSearchField);
  userEvent.type(siteSearchField, "Not a site");
  userEvent.click(siteSearchButton);
  expect(
    await within(container).findByText("No sites were found with that search")
  ).toBeVisible();
});

it("use searchFilter from url", async () => {
  const searchFilter = "CandyMountain";
  replaceHistoryLocation(`http://localhost/admin/stories?q=${searchFilter}`);
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        stories: ({ variables }) => {
          expectAndFail(variables.query).toBe(searchFilter);
          return emptyStories;
        },
      },
    }),
  });
  const container = await screen.findByTestId("stories-container");

  const searchField = within(container).getByRole("textbox", {
    name: "Search by story title or author",
  });
  await waitFor(() => {
    expect(searchField).toHaveValue(searchFilter);
  });
});

it("shows stories only for sites within a site moderator's scope and single-site mods have no site search", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => users.moderators[1],
          stories: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              first: 10,
              query: null,
              siteIDs: ["site-1"],
            });
            return {
              edges: [{ node: stories[0], cursor: stories[0].createdAt }],
              pageInfo: { endCursor: null, hasNextPage: false },
            };
          },
        },
      }),
    });
  });
  const container = await screen.findByTestId("stories-container");

  expect(
    within(container).getByRole("row", {
      name: "Finally a Cure for Cancer Vin Hoa 11/29/2018, 4:01 PM 3 2 5 Open",
    })
  ).toBeVisible();
  expect(
    within(container).queryByRole("row", {
      name: "First Colony on Mars Linh Nguyen 11/29/2018, 4:01 PM 3 2 5 Open",
    })
  ).not.toBeInTheDocument();

  // single-site moderators will only ever need to see stories for one site, so they don't
  // see a site search
  const siteSearchField = within(container).queryByRole("textbox", {
    name: "Search by site name",
  });
  expect(siteSearchField).not.toBeInTheDocument();
});
