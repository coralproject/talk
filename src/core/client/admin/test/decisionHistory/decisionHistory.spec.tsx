import { get, merge } from "lodash";
import sinon from "sinon";

import {
  createSinonStub,
  getByTestID,
  getByText,
  limitSnapshotTo,
  replaceHistoryLocation,
  wait,
  waitForElement,
} from "talk-framework/testHelpers";

import create from "../create";
import { moderationActions, settings } from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/configure/auth");
});

const commentModerationActionHistory = createSinonStub(
  s => s.throws(),
  s =>
    s.withArgs({ first: 5 }).returns({
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
    }),
  s =>
    s
      .withArgs({
        first: 10,
        after: moderationActions[1].createdAt,
      })
      .returns({
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
      })
);

const createTestRenderer = async (resolver: any = {}) => {
  const resolvers = {
    ...resolver,
    Query: {
      ...resolver.Query,
      me: sinon.stub().returns({
        id: "me",
        commentModerationActionHistory,
      }),
      settings: sinon
        .stub()
        .returns(merge(settings, get(resolver, "Query.settings"))),
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
  await waitForElement(() =>
    getByTestID("decisionHistory-toggle", testRenderer.root)
  );
  return testRenderer;
};

async function createTestRendererAndOpenPopover() {
  const testRenderer = await createTestRenderer();
  const toggle = testRenderer.root.findByProps({
    "data-test": "decisionHistory-toggle",
  })!;
  toggle.props.onClick();
  return testRenderer;
}

it("renders decision history popover button", async () => {
  const testRenderer = await createTestRenderer();
  expect(
    limitSnapshotTo("decisionHistory-popover", testRenderer.toJSON())
  ).toMatchSnapshot();
});

it("opens popover when clicked on button showing loading state", async () => {
  const testRenderer = await createTestRendererAndOpenPopover();
  expect(
    limitSnapshotTo("decisionHistory-loading-container", testRenderer.toJSON())
  ).toMatchSnapshot();
});

it("render popover content", async () => {
  const testRenderer = await createTestRendererAndOpenPopover();
  await waitForElement(() =>
    getByTestID("decisionHistory-container", testRenderer.root)
  );
  expect(
    limitSnapshotTo("decisionHistory-container", testRenderer.toJSON())
  ).toMatchSnapshot();
});

it("loads more", async () => {
  const testRenderer = await createTestRendererAndOpenPopover();
  const decisionHistoryContainer = await waitForElement(() =>
    getByTestID("decisionHistory-container", testRenderer.root)
  );
  const ShowMoreButton = getByText("Show More", decisionHistoryContainer)!;
  expect(ShowMoreButton.props.disabled).toBeFalsy();
  ShowMoreButton.props.onClick();
  expect(ShowMoreButton.props.disabled).toBeTruthy();
  await wait(() => {
    expect(() => getByText("Show More", decisionHistoryContainer)).toThrow();
  });
  expect(
    limitSnapshotTo("decisionHistory-container", testRenderer.toJSON())
  ).toMatchSnapshot();
});
