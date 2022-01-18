import sinon from "sinon";

import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
import {
  act,
  createSinonStub,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { comments, settings, stories, viewerWithComments } from "../fixtures";
import create from "./create";

interface Options {
  archivingEnabled: boolean;
}

const createTestRenderer = (options: Options = { archivingEnabled: false }) => {
  const meStub = {
    ...viewerWithComments,
    comments: createSinonStub(
      (s) => s.throws(),
      (s) =>
        s.withArgs({ first: 5, orderBy: "CREATED_AT_DESC" }).returns({
          edges: [
            {
              node: { ...comments[0], story: stories[0] },
              cursor: comments[0].createdAt,
            },
            {
              node: { ...comments[1], story: stories[0] },
              cursor: comments[1].createdAt,
            },
          ],
          pageInfo: {
            endCursor: comments[1].createdAt,
            hasNextPage: true,
          },
        }),
      (s) =>
        s
          .withArgs({
            first: 10,
            orderBy: "CREATED_AT_DESC",
            after: comments[1].createdAt,
          })
          .returns({
            edges: [
              {
                node: { ...comments[2], story: stories[0] },
                cursor: comments[2].createdAt,
              },
            ],
            pageInfo: {
              endCursor: comments[2].createdAt,
              hasNextPage: false,
            },
          })
    ),
  };

  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      stream: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: stories[0].id, url: null })
            .returns(stories[0])
      ),
      viewer: sinon.stub().returns(meStub),
    },
  };

  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue("MY_COMMENTS", "profileTab");
      localRecord.setValue(stories[0].id, "storyID");
      localRecord.setValue(options.archivingEnabled, "archivingEnabled");
      localRecord.setValue(
        DEFAULT_AUTO_ARCHIVE_OLDER_THAN,
        "autoArchiveOlderThanMs"
      );
    },
  });

  return testRenderer;
};

it("renders profile", async () => {
  const testRenderer = createTestRenderer();
  const commentHistory = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-commentHistory")
  );
  expect(within(commentHistory).toJSON()).toMatchSnapshot();
  expect(await within(commentHistory).axe()).toHaveNoViolations();
});

it("loads more comments", async () => {
  const testRenderer = createTestRenderer();
  const commentHistory = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-commentHistory")
  );

  // Get amount of comments before.
  const commentsBefore = within(commentHistory).getAllByTestID(
    /^historyComment-/
  ).length;

  act(() => {
    within(commentHistory).getByText("Load More").props.onClick();
  });

  // Wait for loading.
  await act(() =>
    wait(() =>
      expect(within(commentHistory).queryByText("Load More")).toBeNull()
    )
  );

  expect(within(commentHistory).getAllByTestID(/^historyComment-/).length).toBe(
    commentsBefore + 1
  );
});

it("shows archived notification when archiving enabled", async () => {
  const testRenderer = createTestRenderer({ archivingEnabled: true });
  const commentHistory = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-commentHistory")
  );

  expect(
    within(commentHistory).getByText(
      "This is all of your comments from the previous",
      {
        exact: false,
      }
    )
  ).toBeDefined();
});

it("doesn't show archived notification when archiving disabled", async () => {
  const testRenderer = createTestRenderer({ archivingEnabled: false });
  const commentHistory = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-commentHistory")
  );

  expect(
    within(commentHistory).queryByText(
      "This is all of your comments from the previous",
      {
        exact: false,
      }
    )
  ).toBeNull();
});
