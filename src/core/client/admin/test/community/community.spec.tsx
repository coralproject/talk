import { get, merge } from "lodash";
import TestRenderer from "react-test-renderer";
import sinon from "sinon";

import { GQLUSER_ROLE } from "talk-framework/schema";
import {
  createSinonStub,
  findParentWithType,
  replaceHistoryLocation,
  waitForElement,
  waitUntilThrow,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import {
  communityUsers,
  emptyCommunityUsers,
  settings,
  users,
} from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});

const createTestRenderer = async (resolver: any = {}) => {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(resolver, "Query.settings"))),
      users: sinon.stub().callsFake((_, data) => {
        expectAndFail(data.role).toBeFalsy();
        return communityUsers;
      }),
      viewer: sinon.stub().returns(users[0]),
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
    within(testRenderer.root).getByTestID("community-container")
  );
  return { testRenderer, container };
};

it("renders community", async () => {
  const { container } = await createTestRenderer();
  expect(within(container).toJSON()).toMatchSnapshot();
});

it("renders empty community", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: sinon.stub().returns(emptyCommunityUsers),
    },
  });
  expect(within(container).toJSON()).toMatchSnapshot();
});

it("filter by role", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: createSinonStub(
        s => s.onFirstCall().returns(communityUsers),
        s =>
          s.onSecondCall().callsFake((_, data) => {
            expectAndFail(data.role).toBe(GQLUSER_ROLE.COMMENTER);
            return emptyCommunityUsers;
          })
      ),
    },
  });

  const selectField = within(container).getByLabelText("Search by role");
  const commentersOption = within(selectField).getByText("Commenters");

  TestRenderer.act(() => {
    selectField.props.onChange({
      target: { value: commentersOption.props.value.toString() },
    });
    // TODO: Fix act warnings until await Promise.resolve();
    // or whatever comes out at https://github.com/facebook/react/issues/14769
  });

  await waitForElement(() =>
    within(container).getByText("We could not find anyone", { exact: false })
  );
});

it("can't change viewer role", async () => {
  const viewer = users[0];
  const { container } = await createTestRenderer();

  const viewerRow = within(container).getByText(viewer.username, {
    selector: "tr",
  });
  expect(() => within(viewerRow).getByLabelText("Change role")).toThrow();
});

it("change user role", async () => {
  const user = users[1];
  const updateUserRole = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input).toMatchObject({
      userID: user.id,
      role: GQLUSER_ROLE.STAFF,
    });
    const userRecord = merge({}, user, { role: data.input.role });
    return {
      user: userRecord,
      clientMutationId: data.input.clientMutationId,
    };
  });

  const { container } = await createTestRenderer({
    Mutation: { updateUserRole },
  });

  const userRow = within(container).getByText(user.username, {
    selector: "tr",
  });

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change role")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );

  TestRenderer.act(() => {
    within(popup)
      .getByText("Staff")
      .props.onClick();
  });

  within(userRow).getByText("Staff");
  expect(updateUserRole.called).toBe(true);
});

it("can't change role as a moderator", async () => {
  const viewer = users[1];
  const { container } = await createTestRenderer({
    Query: {
      viewer: sinon.stub().returns(viewer),
    },
  });
  expect(() => within(container).getByLabelText("Change role")).toThrow();
});

it("load more", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: createSinonStub(
        s =>
          s.onFirstCall().returns({
            edges: [
              { node: users[0], cursor: users[0].createdAt },
              { node: users[1], cursor: users[1].createdAt },
            ],
            pageInfo: { endCursor: users[1].createdAt, hasNextPage: true },
          }),
        s =>
          s.onSecondCall().returns({
            edges: [{ node: users[2], cursor: users[2].createdAt }],
            pageInfo: { endCursor: users[2].createdAt, hasNextPage: false },
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
  within(container).getByText(users[2].username);
});

it("filter by search", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: createSinonStub(
        s => s.onFirstCall().returns(communityUsers),
        s =>
          s.onSecondCall().callsFake((_, data) => {
            expectAndFail(data.query).toBe("search");
            return emptyCommunityUsers;
          })
      ),
    },
  });

  const searchField = within(container).getByLabelText("Search by username", {
    exact: false,
  });
  const form = findParentWithType(searchField, "form")!;

  TestRenderer.act(() => {
    searchField.props.onChange({
      target: { value: "search" },
    });
    form.props.onSubmit();
  });

  await waitForElement(() =>
    within(container).getByText("could not find anyone", { exact: false })
  );
});
