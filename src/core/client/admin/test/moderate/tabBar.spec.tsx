import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  toJSON,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
  siteConnection,
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
          sites: () => siteConnection,
          comments: () => emptyRejectedComments,
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

describe("tab bar", () => {
  it("renders tab bar (empty queues)", async () => {
    await act(async () => {
      const { testRenderer } = await createTestRenderer();
      const { getByTestID } = within(testRenderer.root);
      await waitForElement(() => getByTestID("moderate-container"));
      expect(
        toJSON(getByTestID("moderate-tabBar-container"))
      ).toMatchSnapshot();
    });
  });
  it("should not show moderate story link in comment cards", async () => {
    await act(async () => {
      const { testRenderer } = await createTestRenderer();
      const { getByTestID } = within(testRenderer.root);
      await waitForElement(() => getByTestID("moderate-container"));
      expect(
        within(testRenderer.root).queryByText("Moderate Story")
      ).toBeNull();
    });
  });
});
