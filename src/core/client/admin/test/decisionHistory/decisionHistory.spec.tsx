import { pureMerge } from "talk-common/utils";
import {
  GQLResolver,
  UserToCommentModerationActionHistoryResolver,
} from "talk-framework/schema";
import {
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  toJSON,
  waitForElement,
  waitUntilThrow,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { moderationActions, settings, users } from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/configure/auth");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer } = create({
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
      localRecord.setValue(true, "loggedIn");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  const { getByTestID } = within(testRenderer.root);
  await waitForElement(() => getByTestID("decisionHistory-toggle"));
  return testRenderer;
}

async function createTestRendererAndOpenPopover() {
  const testRenderer = await createTestRenderer();
  const toggle = testRenderer.root.findByProps({
    "data-testid": "decisionHistory-toggle",
  })!;
  toggle.props.onClick();
  return testRenderer;
}

it("renders decision history popover button", async () => {
  const testRenderer = await createTestRenderer();
  const popover = within(testRenderer.root).getByTestID(
    "decisionHistory-popover"
  );
  expect(toJSON(popover)).toMatchSnapshot();
});

it("opens popover when clicked on button showing loading state", async () => {
  const testRenderer = await createTestRendererAndOpenPopover();
  const container = within(testRenderer.root).getByTestID(
    "decisionHistory-loading-container"
  );
  expect(toJSON(container)).toMatchSnapshot();
});

it("render popover content", async () => {
  const testRenderer = await createTestRendererAndOpenPopover();
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("decisionHistory-container")
  );
  expect(toJSON(container)).toMatchSnapshot();
});

it("loads more", async () => {
  const testRenderer = await createTestRendererAndOpenPopover();

  // Wait for decision history to render.
  const decisionHistoryContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("decisionHistory-container")
  );

  const { getByText } = within(decisionHistoryContainer);

  // Find active show more button.
  const ShowMoreButton = getByText("Show More");
  expect(ShowMoreButton.props.disabled).toBeFalsy();

  // Click show more!
  ShowMoreButton.props.onClick();

  // Disable show more while loading.
  expect(ShowMoreButton.props.disabled).toBeTruthy();

  // Wait until show more disappears.
  await waitUntilThrow(() => getByText("Show More"));

  // Make a snapshot.
  expect(toJSON(decisionHistoryContainer)).toMatchSnapshot();
});
