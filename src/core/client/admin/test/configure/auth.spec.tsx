import { cloneDeep } from "lodash";
import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  findParentWithType,
  replaceHistoryLocation,
  toJSON,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import { settingsWithEmptyAuth, users } from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/configure/auth");
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
          settings: () => settingsWithEmptyAuth,
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
  const configureContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("configure-container")
  );
  const authContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-authContainer")
  );
  return { context, testRenderer, configureContainer, authContainer };
}

it("renders configure auth", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("rotate sso key", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        rotateSSOKey: () => {
          return {
            settings: pureMerge<typeof settingsWithEmptyAuth>(
              settingsWithEmptyAuth,
              {
                auth: {
                  integrations: {
                    sso: {
                      enabled: true,
                      keys: [
                        {
                          kid: "kid-01",
                          secret: "secret",
                          createdAt: "2015-01-01T00:00:00.000Z",
                          lastUsedAt: "2016-01-01T01:45:00.000Z",
                          rotatedAt: "2016-01-01T01:45:00.000Z",
                          inactiveAt: "2016-01-01T01:45:00.000Z",
                        },
                        {
                          kid: "kid-02",
                          secret: "new-secret",
                          createdAt: "2019-01-01T01:45:00.000Z",
                        },
                      ],
                    },
                  },
                },
              }
            ),
          };
        },
      },
    }),
  });
  const container = within(testRenderer.root).getByTestID("configure-auth-sso");
  act(() => {
    within(container)
      .getByLabelText("Enabled")
      .props.onChange({});
  });

  act(() => {
    within(container)
      .getByText("Rotate", { selector: "button" })
      .props.onClick();
  });

  const rotateNow = await waitForElement(() => {
    return within(container).getByText("Now", { selector: "button" });
  });

  act(() => {
    rotateNow.props.onClick();
  });

  await wait(() => {
    // Check that we have two SSO Keys that match
    // our expected key IDs
    const keyIDs = within(container).getAllByTestID("SSO-Key-ID");
    const hasOldKey = keyIDs.some(k => k.props.value === "kid-01");
    const hasNewKey = keyIDs.some(k => k.props.value === "kid-02");
    expect(hasNewKey).toBe(true);
    expect(hasOldKey).toBe(true);

    const statuses = within(container).getAllByTestID("SSO-Key-Status");
    expect(statuses.length).toBe(2);
    const firstStatus: any = toJSON(statuses[0]);
    const firstStatusIsActive = firstStatus.children.some(
      (s: string) => s === "Active"
    );
    expect(firstStatusIsActive).toBe(true);
    const secondStatus: any = toJSON(statuses[1]);
    const secondStatusIsActive = secondStatus.children.some(
      (s: string) => s === "Active"
    );
    expect(secondStatusIsActive).toBe(false);
  });
});

it("prevents admin lock out", async () => {
  const { testRenderer } = await createTestRenderer();

  const container = within(testRenderer.root).getByTestID(
    "configure-auth-local"
  );

  // Let's disable local auth.
  act(() => {
    within(container)
      .getByLabelText("Enabled")
      .props.onChange();
  });

  // Send form
  await act(async () =>
    findParentWithType(container, "form")!.props.onSubmit()
  );
  await waitForElement(() =>
    within(testRenderer.root).getByText(
      "Please enable at least one authentication integration",
      { exact: false }
    )
  );
});

it("prevents stream lock out", async () => {
  let settingsRecord = cloneDeep(settingsWithEmptyAuth);
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updateSettings: ({ variables }) => {
          expectAndFail(variables.settings.auth!.integrations!.local).toEqual({
            enabled: true,
            allowRegistration: true,
            targetFilter: {
              admin: true,
              stream: false,
            },
          });
          settingsRecord = pureMerge(settingsRecord, variables.settings);
          return {
            settings: settingsRecord,
          };
        },
      },
    }),
  });
  const origConfirm = window.confirm;
  const stubContinue = sinon.stub().returns(true);
  const stubCancel = sinon.stub().returns(false);

  const container = within(testRenderer.root).getByTestID(
    "configure-auth-local"
  );
  const streamTarget = within(container).getByLabelText("Comment Stream");
  const form = findParentWithType(container, "form")!;
  const saveChanges = within(testRenderer.root).getByText("Save Changes", {
    selector: "button",
  });

  try {
    window.confirm = stubCancel;
    // Let's disable stream target in local auth.
    act(() => streamTarget.props.onChange());

    // Send form
    await act(async () => await form.props.onSubmit());

    // Submit button should not be disabled because we canceled the submit.
    wait(() => expect(saveChanges.props.disabled).toBe(true));
    wait(() => {
      expect(stubCancel.calledOnce).toBe(true);
    });

    window.confirm = stubContinue;
    // Let's enable stream target in local auth.
    act(() => streamTarget.props.onChange());

    // Send form
    await act(async () => await form.props.onSubmit());

    expect(stubContinue.calledOnce).toBe(true);
  } finally {
    window.confirm = origConfirm;
  }
});

it("change settings", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        discoverOIDCConfiguration: ({ variables }) => {
          expectAndFail(variables).toEqual({ issuer: "http://issuer.com" });
          return {
            issuer: "http://issuer.com",
            tokenURL: "http://issuer.com/tokenURL",
            jwksURI: "http://issuer.com/jwksURI",
            authorizationURL: "http://issuer.com/authorizationURL",
          };
        },
      },
      Mutation: {
        updateSettings: ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              expectAndFail(
                variables.settings.auth!.integrations!.facebook
              ).toEqual({
                enabled: true,
                allowRegistration: true,
                targetFilter: {
                  admin: true,
                  stream: true,
                },
                clientID: "myClientID",
                clientSecret: "myClientSecret",
              });
              return {
                settings: pureMerge(settingsWithEmptyAuth, variables.settings),
              };
            default:
              expectAndFail(
                variables.settings.auth!.integrations!.oidc
              ).toEqual({
                enabled: true,
                allowRegistration: false,
                targetFilter: {
                  admin: true,
                  stream: true,
                },
                name: "name",
                clientID: "clientID",
                clientSecret: "clientSecret",
                issuer: "http://issuer.com",
                jwksURI: "http://issuer.com/jwksURI",
                authorizationURL: "http://issuer.com/authorizationURL",
                tokenURL: "http://issuer.com/tokenURL",
              });
              return {
                settings: pureMerge(settingsWithEmptyAuth, variables.settings),
              };
          }
        },
      },
    }),
  });

  const facebookContainer = within(testRenderer.root).getByTestID(
    "configure-auth-facebook-container"
  );
  const facebookEnabled = within(facebookContainer).getByLabelText("Enabled");

  const oidcContainer = within(testRenderer.root).getByTestID(
    "configure-auth-oidc-container"
  );
  const oidcEnabled = within(oidcContainer).getByLabelText("Enabled");

  const form = findParentWithType(facebookContainer, "form")!;
  const saveChanges = within(testRenderer.root).getByText("Save Changes", {
    selector: "button",
  });

  // Let's change some facebook settings.
  act(() => facebookEnabled.props.onChange({}));
  act(() =>
    within(facebookContainer)
      .getByLabelText("Client ID", { exact: false })
      .props.onChange("myClientID")
  );
  act(() =>
    within(facebookContainer)
      .getByLabelText("Client secret", { exact: false })
      .props.onChange("myClientSecret")
  );

  // Send form
  act(() => {
    form.props.onSubmit();
  });
  // Submit button should be disabled.
  expect(saveChanges.props.disabled).toBe(true);
  // Disable other fields while submitting
  // We are only testing for one here right now..
  expect(facebookEnabled.props.disabled).toBe(true);

  await act(async () => {
    // When submitting finished, the fields become enabled again.
    await wait(() => expect(facebookEnabled.props.disabled).toBe(false));
  });

  // Now let's enable oidc
  act(() => oidcEnabled.props.onChange({}));
  expect(() =>
    within(oidcContainer).getAllByText("This field is required", {
      exact: false,
    })
  ).toThrow();

  // Try to submit form, this will give validation error messages.
  act(() => {
    form.props.onSubmit();
  });

  within(oidcContainer).getAllByText("This field is required", {
    exact: false,
  });

  // Fill form
  act(() =>
    within(oidcContainer)
      .getByLabelText("Provider name", { exact: false })
      .props.onChange("name")
  );
  act(() =>
    within(oidcContainer)
      .getByLabelText("Client ID", { exact: false })
      .props.onChange("clientID")
  );
  act(() =>
    within(oidcContainer)
      .getByLabelText("Client secret", { exact: false })
      .props.onChange("clientSecret")
  );
  act(() =>
    within(oidcContainer)
      .getByLabelText("Issuer", { exact: false })
      .props.onChange("http://issuer.com")
  );

  // Discover the rest.
  await act(
    async () =>
      await within(oidcContainer)
        .getByText("Discover", { selector: "button" })
        .props.onClick()
  );

  // Try to submit again, this should work now.
  act(() => {
    form.props.onSubmit();
  });
  // Submit button should be disabled.
  expect(saveChanges.props.disabled).toBe(true);
  // Disable other fields while submitting
  // We are only testing for one here right now..
  expect(oidcEnabled.props.disabled).toBe(true);

  await act(async () => {
    // When submitting finished, the fields become enabled again.
    await wait(() => expect(oidcEnabled.props.disabled).toBe(false));
  });
});
