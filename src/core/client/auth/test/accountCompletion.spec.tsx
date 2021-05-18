import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import {
  act,
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import { GQLResolver } from "coral-framework/testHelpers/schema";

import create from "./create";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

let windowMock: ReturnType<typeof mockWindow>;

const accessToken = createAccessToken();
const viewer = { id: "me", profiles: [] };

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
      localRecord.setValue("CREATE_PASSWORD", "view");
      localRecord.setValue(accessToken, "accessToken");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return {
    context,
    testRenderer,
    root: testRenderer.root,
  };
}

beforeEach(async () => {
  windowMock = mockWindow();
});

afterEach(async () => {
  windowMock.restore();
});

it("renders addEmailAddress view", async () => {
  const { root } = await createTestRenderer();
  await waitForElement(() =>
    within(root).getByTestID("addEmailAddress-container")
  );
});

it("renders createUsername view", async () => {
  const { root } = await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "hans@test.com",
          }),
      },
    },
  });
  await waitForElement(() =>
    within(root).getByTestID("createUsername-container")
  );
});

it("renders createPassword view", async () => {
  const { root } = await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "hans@test.com",
            username: "hans",
          }),
      },
    },
  });
  await waitForElement(() =>
    within(root).getByTestID("createPassword-container")
  );
});

it("renders account linking view", async () => {
  const { root } = await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "",
            username: "hans",
            duplicateEmail: "my@email.com",
          }),
      },
    },
  });
  await act(async () => {
    await waitForElement(() =>
      within(root).getByTestID("linkAccount-container")
    );
  });
  within(root).getByText("my@email.com", { exact: false });
});

it("renders account linking view, but then switch to add email view", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "",
            username: "hans",
            duplicateEmail: "my@email.com",
          }),
      },
    },
  });
  await act(async () => {
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("linkAccount-container")
    );
  });
  const button = await waitForElement(() =>
    within(testRenderer.root).getByText("Use a different email address", {
      exact: false,
    })
  );
  await act(async () => {
    button.props.onClick();
    await waitForElement(() =>
      within(testRenderer.root).queryByText("Add Email Address", {
        exact: false,
      })
    );
  });
});

it("do not render createPassword view when local auth is disabled", async () => {
  await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "hans@test.com",
            username: "hans",
          }),

        settings: () =>
          pureMerge(settings, {
            auth: {
              integrations: {
                local: {
                  enabled: false,
                },
              },
            },
          }),
      },
    },
  });
  // Wait till window is closed.
  await wait(() => expect(windowMock.closeStub.called).toBe(true));
});

it("send back access token", async () => {
  const { context } = await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "hans@test.com",
            username: "hans",
            profiles: [{ __typename: "LocalProfile" }],
          }),
      },
    },
  });

  const postMessageMock = sinon.mock(context.postMessage);
  postMessageMock
    .expects("send")
    .withArgs("setAccessToken", accessToken, window.opener)
    .atLeast(1);

  // Wait till window is closed.
  await wait(() => expect(windowMock.closeStub.called).toBe(true));

  postMessageMock.verify();
});
