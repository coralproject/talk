import { noop } from "lodash";
import { ReactTestInstance, ReactTestRenderer } from "react-test-renderer";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  findParentWithType,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  emptyStories,
  settings,
  site,
  siteConnection,
  stories,
  storyConnection,
  users,
} from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");
});

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context, subscriptionHandler } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          moderationQueues: () => emptyModerationQueues,
          comments: () => emptyRejectedComments,
          site: () => site,
          sites: () => siteConnection,
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
  return { testRenderer, context, subscriptionHandler };
}

const openSearchBar = async (testRenderer: ReactTestRenderer) => {
  await act(async () => {
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("moderate-searchBar-container")
    );
  });
  const searchBar = within(testRenderer.root).getByTestID(
    "moderate-searchBar-container"
  );
  const textField = within(searchBar).getByLabelText(
    "Search or jump to story..."
  );
  const form = findParentWithType(textField, "form")!;
  act(() => textField.props.onFocus({}));
  return { searchBar, textField, form };
};

describe("all stories", () => {
  it("renders search bar", async () => {
    let searchBar: ReactTestInstance;
    await act(async () => {
      const { testRenderer } = await createTestRenderer();
      searchBar = await waitForElement(() =>
        within(testRenderer.root).getByTestID("moderate-searchBar-container")
      );
    });
    expect(within(searchBar!).toJSON()).toMatchSnapshot();
  });

  describe("active", () => {
    it("search with no results", async () => {
      const query = "InterestingStory";
      const { testRenderer } = await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            stories: ({ variables }) => {
              expectAndFail(variables.query).toBe(query);
              return emptyStories;
            },
          },
        }),
      });
      const { searchBar, textField, form } = await openSearchBar(testRenderer);
      expect(within(searchBar).toJSON()).toMatchSnapshot();

      await act(async () => {
        // Search for sth.
        textField.props.onChange(query);
        form.props.onSubmit();

        // Ensure no results message is shown.
        await wait(() =>
          within(searchBar).getByText(
            "We could not find any stories matching your criteria",
            {
              exact: false,
            }
          )
        );
      });

      act(() => {
        // Blurring should close the listbox.
        textField.props.onBlur({});
      });
      expect(within(searchBar).queryByText("No results")).toBeNull();
    });
    it("search with actual results", async () => {
      const query = "InterestingStory";
      const {
        testRenderer,
        context: { transitionControl },
      } = await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            stories: ({ variables }) => {
              expectAndFail(variables.query).toBe(query);
              return storyConnection;
            },
          },
        }),
      });
      transitionControl.allowTransition = false;
      const { searchBar, textField, form } = await openSearchBar(testRenderer);

      const story = storyConnection.edges[0].node;

      let storyOption: ReactTestInstance;

      await act(async () => {
        // Search for sth.
        textField.props.onChange(query);
        form.props.onSubmit();

        // Find the story in the search results.
        storyOption = findParentWithType(
          await waitForElement(() =>
            within(searchBar).getByText(story.metadata!.title!, {
              exact: false,
            })
          ),
          "li"
        )!;
      });

      // Go to story.
      storyOption!.props.onClick({ button: 0, preventDefault: noop });

      // Expect a routing request was made to the right url. history[1] because a redirect happens through /admin/moderate
      expect(transitionControl.history[1].pathname).toBe(
        `/admin/moderate/reported/stories/${story.id}`
      );
    });
    it("search with too many results", async () => {
      const query = "InterestingStory";
      const {
        testRenderer,
        context: { transitionControl },
      } = await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            stories: ({ variables }) => {
              expectAndFail(variables.query).toBe(query);
              return pureMerge<typeof storyConnection>(storyConnection, {
                pageInfo: { hasNextPage: true },
              });
            },
          },
        }),
      });
      transitionControl.allowTransition = false;
      const { searchBar, textField, form } = await openSearchBar(testRenderer);

      let seeAllOption: ReactTestInstance;
      await act(async () => {
        // Search for sth.
        textField.props.onChange(query);
        form.props.onSubmit();

        // Find see all options in the search results.
        seeAllOption = findParentWithType(
          await waitForElement(() =>
            within(searchBar).getByText("See all results", { exact: false })
          ),
          "li"
        )!;
      });

      expect(within(seeAllOption!).toJSON()).toMatchSnapshot();

      // Go to story.
      seeAllOption!.props.onClick({ button: 0, preventDefault: noop });

      // Expect a routing request was made to the right url. history[1] because a redirect happens through /admin/moderate
      expect(transitionControl.history[1].pathname).toBe("/admin/stories");
      expect(transitionControl.history[1].search).toBe(`?q=${query}`);
    });
  });
});
describe("specified story", () => {
  beforeEach(() => {
    replaceHistoryLocation(
      `http://localhost/admin/moderate/stories/${stories[0].id}`
    );
  });
  it("renders search bar", async () => {
    await act(async () => {
      const { testRenderer } = await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            story: () => stories[0],
          },
        }),
      });
      const searchBar = await waitForElement(() =>
        within(testRenderer.root).getByTestID("moderate-searchBar-container")
      );
      const textField = within(searchBar).getByLabelText(
        "Search or jump to story..."
      );
      expect(textField.props.placeholder).toBe(stories[0].metadata!.title);
    });
  });
  it("shows moderate all option", async () => {
    const {
      testRenderer,
      context: { transitionControl },
    } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          story: () => stories[0],
        },
      }),
    });
    transitionControl.allowTransition = false;
    const { searchBar } = await openSearchBar(testRenderer);

    // Find see all options in the search results.
    const moderateAllOptions = findParentWithType(
      await waitForElement(() =>
        within(searchBar).getByText("Moderate all", { exact: false })
      ),
      "li"
    )!;

    // Activate moderate all.
    moderateAllOptions.props.onClick({ button: 0, preventDefault: noop });

    // Expect a routing request was made to the right url. history[1] because a redirect happens through /admin/moderate
    expect(transitionControl.history[1].pathname).toBe(
      "/admin/moderate/reported/sites/site-1"
    );
  });
});
