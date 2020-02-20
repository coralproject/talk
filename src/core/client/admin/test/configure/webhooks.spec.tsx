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
      .getByText(/Add webhook endpoint/)
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

  await act(async () => {
    await wait(() => {
      expect(within(container).toJSON()).toMatchSnapshot();
    });
  });
});

it("displays a list of webhook endpoints that have been configured", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () =>
        pureMerge<typeof settings>(settings, {
          webhooks: {
            endpoints: [
              {
                id: "webhook-endpoint-1",
                enabled: true,
                url: "http://example.com/webhook-endpoint-1",
                all: true,
                events: [],
              },
              {
                id: "webhook-endpoint-2",
                enabled: false,
                url: "http://example.com/webhook-endpoint-2",
                all: true,
                events: [],
              },
            ],
          },
        }),
    },
  });
  const { container } = await createTestRenderer({ resolvers });

  await act(async () => {
    await wait(() => {
      expect(within(container).toJSON()).toMatchSnapshot();
    });
  });
});

it("goes to the webhook endpoint configuration page when selected", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () =>
        pureMerge<typeof settings>(settings, {
          webhooks: {
            endpoints: [
              {
                id: "webhook-endpoint-1",
                enabled: true,
                url: "http://example.com/webhook-endpoint-1",
                all: true,
                events: [],
              },
            ],
          },
        }),
    },
  });
  const {
    container,
    context: { transitionControl },
  } = await createTestRenderer({ resolvers });

  // Prevent router transitions.
  transitionControl.allowTransition = false;

  act(() => {
    const row = within(container).getByTestID(
      "webhook-endpoint-webhook-endpoint-1"
    );

    within(row)
      .getByText(/Details/, {
        selector: "a",
      })
      .props.onClick({ button: 0, preventDefault: noop });
  });

  // Expect a routing request was made to the right url.
  await act(async () => {
    await wait(() => {
      expect(transitionControl.history[0].pathname).toBe(
        "/admin/configure/webhooks/endpoint/webhook-endpoint-1"
      );
    });
  });

  await act(async () => {
    await wait(() => {
      expect(within(container).toJSON()).toMatchSnapshot();
    });
  });
});
