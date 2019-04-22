import { get, merge } from "lodash";
import TestRenderer from "react-test-renderer";
import sinon from "sinon";

import {
  createSinonStub,
  findParentWithType,
  replaceHistoryLocation,
  waitForElement,
  waitUntilThrow,
  within,
} from "talk-framework/testHelpers";

import { GQLSTORY_STATUS } from "talk-framework/schema";
import create from "../create";
import {
  emptyStories,
  settings,
  stories,
  storyConnection,
  users,
} from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/stories");
});

const createTestRenderer = async (resolver: any = {}) => {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(resolver, "Query.settings"))),
      stories: sinon.stub().callsFake((_, data) => {
        expectAndFail(data.status).toBeFalsy();
        return storyConnection;
      }),
      viewer: sinon.stub().returns(users.admins[0]),
      ...resolver.Query,
    },
  };
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("stories-container")
  );
  return { testRenderer, container };
};

it("renders stories", async () => {
  const { container } = await createTestRenderer();
  expect(within(container).toJSON()).toMatchSnapshot();
});

it("renders empty stories", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: sinon.stub().returns(emptyStories),
    },
  });
  expect(within(container).toJSON()).toMatchSnapshot();
});

it("filter by status", async () => {
  const { container } = await createTestRenderer({
    Query: {
      stories: createSinonStub(
        s => s.onFirstCall().returns(storyConnection),
        s =>
          s.onSecondCall().callsFake((_, data) => {
            expectAndFail(data.status).toBe(GQLSTORY_STATUS.CLOSED);
            return emptyStories;
          })
      ),
    },
  });

  const selectField = within(container).getByLabelText("Search by status");
  const closedOption = within(selectField).getByText("Closed Stories");

  TestRenderer.act(() => {
    selectField.props.onChange({
      target: { value: closedOption.props.value.toString() },
    });
    // TODO: Fix act warnings until await Promise.resolve();
    // or whatever comes out at https://github.com/facebook/react/issues/14769
  });

  await waitForElement(() =>
    within(container).getByText("could not find any", { exact: false })
  );
});

it("change story status", async () => {
  const story = stories[1];
  const openStory = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input).toMatchObject({
      id: story.id,
    });
    const storyRecord = merge({}, story, {
      status: GQLSTORY_STATUS.OPEN,
      createdAt: false,
      isClosed: false,
    });
    return {
      story: storyRecord,
      clientMutationId: data.input.clientMutationId,
    };
  });

  const closeStory = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input).toMatchObject({
      id: story.id,
    });
    const storyRecord = merge({}, story, {
      status: GQLSTORY_STATUS.CLOSED,
      createdAt: "2018-11-29T16:01:51.897Z",
      isClosed: true,
    });
    return {
      story: storyRecord,
      clientMutationId: data.input.clientMutationId,
    };
  });

  const { container } = await createTestRenderer({
    Mutation: { openStory, closeStory },
  });

  const storyRow = within(container).getByText(story.metadata!.title!, {
    selector: "tr",
  });

  const changeStatusButton = within(storyRow).getByLabelText("Change status");
  const popup = within(storyRow).getByLabelText(
    "A dropdown to change the story status"
  );

  /** CLOSE STORY */
  TestRenderer.act(() => {
    changeStatusButton.props.onClick();
  });

  TestRenderer.act(() => {
    within(popup)
      .getByText("Closed")
      .props.onClick();
  });

  within(storyRow).getByText("Closed");
  expect(closeStory.called).toBe(true);

  /** OPEN STORY */
  TestRenderer.act(() => {
    changeStatusButton.props.onClick();
  });

  TestRenderer.act(() => {
    within(popup)
      .getByText("Open")
      .props.onClick();
  });

  within(storyRow).getByText("Open");
  expect(openStory.called).toBe(true);
});

it("load more", async () => {
  const { container } = await createTestRenderer({
    Query: {
      stories: createSinonStub(
        s =>
          s.onFirstCall().returns({
            edges: [
              { node: stories[0], cursor: stories[0].createdAt },
              { node: stories[1], cursor: stories[1].createdAt },
            ],
            pageInfo: { endCursor: stories[1].createdAt, hasNextPage: true },
          }),
        s =>
          s.onSecondCall().returns({
            edges: [{ node: stories[2], cursor: stories[2].createdAt }],
            pageInfo: { endCursor: stories[2].createdAt, hasNextPage: false },
          })
      ),
    },
  });
  const loadMore = within(container).getByText("Load More");
  TestRenderer.act(() => {
    loadMore.props.onClick();
  });

  // Wait for load more to disappear.
  await waitUntilThrow(() => within(container).getByText("Load More"));

  // Make sure third user was added.
  within(container).getByText(stories[2].metadata!.title!);
});

it("filter by search", async () => {
  const { container } = await createTestRenderer({
    Query: {
      stories: createSinonStub(
        s => s.onFirstCall().returns(storyConnection),
        s =>
          s.onSecondCall().callsFake((_, data) => {
            expectAndFail(data.query).toBe("search");
            return emptyStories;
          })
      ),
    },
  });

  const searchField = within(container).getByLabelText(
    "Search by story title",
    { exact: false }
  );
  const form = findParentWithType(searchField, "form")!;

  TestRenderer.act(() => {
    searchField.props.onChange({
      target: { value: "search" },
    });
    form.props.onSubmit();
  });

  await waitForElement(() =>
    within(container).getByText("could not find any", { exact: false })
  );
});
