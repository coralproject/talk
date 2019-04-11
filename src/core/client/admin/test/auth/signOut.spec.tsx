import sinon from "sinon";

import { pureMerge } from "talk-common/utils";
import { LOCAL_ID, lookup } from "talk-framework/lib/relay";
import { GQLResolver } from "talk-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
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
          comments: () => emptyRejectedComments,
          viewer: () => viewer,
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

  userMenu.props.onClick();

  const signOutButton = await waitForElement(() =>
    within(testRenderer.root).getByText("Sign Out")
  );
  signOutButton.props.onClick();

  await wait(() => {
    expect(lookup(context.relayEnvironment, LOCAL_ID)!.loggedIn).toBeFalsy();
  });
});
