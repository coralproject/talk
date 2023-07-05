import sinon, { SinonStub } from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
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

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation("http://localhost/admin/moderate/reported");
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          moderationQueues: () => emptyModerationQueues,
          sites: () => siteConnection,
          comments: () => emptyRejectedComments,
          viewer: () => viewer,
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
  return { testRenderer, context };
}

it("logs out", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");

  const { testRenderer, context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth", {
      method: "DELETE",
    })
    .once()
    .returns({});

  const userMenu = await waitForElement(() =>
    within(testRenderer.root).getByText(users.admins[0].username!, {
      selector: "button",
    })
  );

  act(() => {
    userMenu.props.onClick();
  });

  const signOutButton = await waitForElement(() =>
    within(testRenderer.root).getByText("Sign Out", { selector: "button" })
  );
  signOutButton.props.onClick();

  await wait(() => {
    restMock.verify();
    // Wait for new session to start.
    expect((context.clearSession as SinonStub).called).toBe(true);
  });
});
