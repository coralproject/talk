import { noop } from "lodash";

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
import { settings, users } from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/configure/webhooks");
});

const viewer = users.admins[0];

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
      within(testRenderer.root).getByTestID("webhooks-container")
    );

    return { testRenderer, container, context };
  });
}

it("renders webhooks", async () => {
  const { container } = await createTestRenderer();
  await act(async () => {
    await wait(() => {
      expect(within(container).toJSON()).toMatchSnapshot();
    });
  });
});

it("goes to add new webhook endpoint when clicking add", async () => {
  const {
    container,
    context: { transitionControl },
  } = await createTestRenderer();

  // Prevent router transitions.
  transitionControl.allowTransition = false;

  act(() => {
    within(container)
      .getByTestID("add-webhook-endpoint")
      .props.onClick({ button: 0, preventDefault: noop });
  });

  // Expect a routing request was made to the right url.
  await act(async () => {
    await wait(() => {
      expect(transitionControl.history[0].pathname).toBe(
        "/admin/configure/webhooks/add"
      );
    });
  });
});
