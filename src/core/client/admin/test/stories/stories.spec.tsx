import { noop } from "lodash";

import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  GQLSTORY_STATUS,
  MutationToCloseStoryResolver,
  MutationToOpenStoryResolver,
} from "coral-framework/schema";
import {
  act,
  createMutationResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  findParentWithType,
  replaceHistoryLocation,
  wait,
  waitForElement,
  waitUntilThrow,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
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
  const { testRenderer, context } = create({
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

  return await act(async () => {
    const container = await waitForElement(() =>
      within(testRenderer.root).getByTestID("stories-container")
    );

    return { testRenderer, container, context };
  });
}

it("renders stories", async () => {
  const { container } = await createTestRenderer();
  await act(async () => {
    await wait(() => {
      expect(within(container).toJSON()).toMatchSnapshot();
    });
  });
});

it("renders empty stories", async () => {
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        users: () => emptyStories,
      },
    }),
  });

  await act(async () => {
    await wait(() => {
      expect(within(container).toJSON()).toMatchSnapshot();
    });
  });
});

it("goes to moderation when clicking on title", async () => {
  const {
    container,
    context: { transitionControl },
  } = await createTestRenderer();

  // Prevent router transitions.
  transitionControl.allowTransition = false;

  const story = storyConnection.edges[0].node;
  act(() => {
    within(container)
      .getByText(story.metadata!.title!)
      .props.onClick({ button: 0, preventDefault: noop });
  });

  // Expect a routing request was made to the right url.
  await act(async () => {
    await wait(() => {
      expect(transitionControl.history[0].pathname).toBe(
        `/admin/moderate/stories/${story.id}`
      );
    });
  });
});

it("filter by status", async () => {
  const { container } = await createTestRenderer({
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

  const selectField = within(container).getByLabelText("Search by status");
  const closedOption = within(selectField).getByText("Closed Stories");

  act(() => {
    selectField.props.onChange({
      target: { value: closedOption.props.value.toString() },
    });
  });

  await act(async () => {
    await waitForElement(() =>
      within(container).getByText("could not find any", { exact: false })
    );
  });
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

  const { container } = await createTestRenderer({
    resolvers: {
      Mutation: { openStory, closeStory },
    },
  });

  const storyRow = within(container).getByText(story.metadata!.title!, {
    selector: "tr",
  });

  const changeStatusButton = within(storyRow).getByLabelText("Select action");
  const popup = within(storyRow).getByLabelText(
    "A dropdown to select story actions"
  );

  /** CLOSE STORY */
  act(() => {
    changeStatusButton.props.onClick();
  });
  act(() => {
    within(popup)
      .getByText("Close story", { selector: "button" })
      .props.onClick();
  });

  within(storyRow).getByText("Closed");
  expect(closeStory.called).toBe(true);

  /** OPEN STORY */
  act(() => {
    changeStatusButton.props.onClick();
  });

  act(() => {
    within(popup)
      .getByText("Open story", { selector: "button" })
      .props.onClick();
  });

  within(storyRow).getByText("Open");
  expect(openStory.called).toBe(true);
});

it("load more", async () => {
  const { container } = await createTestRenderer({
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
  const loadMore = within(container).getByText("Load More");
  act(() => {
    loadMore.props.onClick();
  });

  await act(async () => {
    // Wait for load more to disappear.
    await waitUntilThrow(() => within(container).getByText("Load More"));
  });

  await act(async () => {
    await wait(() => {
      // Make sure third user was added.
      within(container).getByText(stories[2].metadata!.title!);
    });
  });
});

it("filter by search", async () => {
  const { container } = await createTestRenderer({
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

  const searchField = within(container).getByLabelText(
    "Search by story title",
    { exact: false }
  );
  const form = findParentWithType(searchField, "form")!;

  act(() =>
    searchField.props.onChange({
      target: { value: "search" },
    })
  );
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await waitForElement(() =>
      within(container).getByText("could not find any", { exact: false })
    );
  });
});

it("search by site name", async () => {
  const { container } = await createTestRenderer({
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

  const siteSearchField = within(container).getByTestID(
    "site-search-textField"
  );
  await act(async () => {
    await wait(() => {
      expect(siteSearchField.props.value).toBe("");
    });
  });

  act(() =>
    siteSearchField.props.onChange({
      target: { value: "Test" },
    })
  );

  const siteSearchButton = within(container).getByTestID("site-search-button");
  act(() => {
    siteSearchButton.props.onClick({ preventDefault: noop });
  });

  await act(async () => {
    await waitForElement(() => within(container).getByText("Test Site"));
    within(container).getByText("Test Site").props.onClick();
  });

  await act(async () => {
    await wait(() => {
      expect(siteSearchField.props.value).toBe("Test Site");
    });
  });

  act(() =>
    siteSearchField.props.onChange({
      target: { value: "Not a site" },
    })
  );
  act(() => {
    siteSearchButton.props.onClick({ preventDefault: noop });
  });

  await act(async () => {
    await waitForElement(() =>
      within(container).getByText("No sites were found with that search")
    );
  });
});

it("use searchFilter from url", async () => {
  const searchFilter = "CandyMountain";
  replaceHistoryLocation(`http://localhost/admin/stories?q=${searchFilter}`);
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        stories: ({ variables }) => {
          expectAndFail(variables.query).toBe(searchFilter);
          return emptyStories;
        },
      },
    }),
  });

  const searchField = within(container).getByLabelText(
    "Search by story title",
    { exact: false }
  );

  await act(async () => {
    await wait(() => {
      expect(searchField.props.value).toBe(searchFilter);
    });
  });
});
