import { cloneDeep, get, merge } from "lodash";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import {
  createSinonStub,
  inputPredicate,
  limitSnapshotTo,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { settingsWithEmptyAuth, users } from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/configure/auth");
});

const createTestRenderer = async (resolver: any = {}) => {
  const resolvers = {
    ...resolver,
    Query: {
      ...resolver.Query,
      settings: sinon
        .stub()
        .returns(
          merge({}, settingsWithEmptyAuth, get(resolver, "Query.settings"))
        ),
      viewer: sinon.stub().returns(users.admins[0]),
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
  const configureContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("configure-container")
  );
  const authContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-authContainer")
  );
  return { testRenderer, configureContainer, authContainer };
};

it("renders configure auth", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("regenerate sso key", async () => {
  const { testRenderer } = await createTestRenderer({
    Mutation: {
      regenerateSSOKey: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          return {
            settings: merge({}, settingsWithEmptyAuth, {
              auth: {
                integrations: {
                  sso: {
                    key: "==GENERATED_KEY==",
                    keyGeneratedAt: "2018-11-12T23:26:06.239Z",
                  },
                },
              },
            }),
            clientMutationId: data.input.clientMutationId,
          };
        })
      ),
    },
  });
  testRenderer.root
    .find(inputPredicate("auth.integrations.sso.enabled"))
    .props.onChange({});

  testRenderer.root
    .find(inputPredicate("configure-auth-sso-regenerate"))
    .props.onClick();

  await timeout();

  expect(
    limitSnapshotTo("configure-auth-sso-key", testRenderer.toJSON())
  ).toMatchSnapshot();
});

it("prevents admin lock out", async () => {
  const { testRenderer } = await createTestRenderer();

  // Let's disable local auth.
  testRenderer.root
    .find(inputPredicate("auth.integrations.local.enabled"))
    .props.onChange();

  // Send form
  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();
  await timeout();
  expect(
    limitSnapshotTo("configure-auth-submitError", testRenderer.toJSON())
  ).toMatchSnapshot();
});

it("prevents stream lock out", async () => {
  let settingsRecord = cloneDeep(settingsWithEmptyAuth);
  const { testRenderer } = await createTestRenderer({
    Mutation: {
      updateSettings: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          expectAndFail(data.input.settings.auth.integrations.local).toEqual({
            enabled: true,
            allowRegistration: true,
            targetFilter: {
              admin: true,
              stream: false,
            },
          });
          settingsRecord = merge({}, settingsRecord, data.input.settings);
          return {
            settings: settingsRecord,
            clientMutationId: data.input.clientMutationId,
          };
        })
      ),
    },
  });
  const origConfirm = window.confirm;
  const stubContinue = sinon.stub().returns(true);
  const stubCancel = sinon.stub().returns(false);

  try {
    window.confirm = stubCancel;
    // Let's disable stream target in local auth.
    testRenderer.root
      .find(inputPredicate("auth.integrations.local.targetFilter.stream"))
      .props.onChange();

    // Send form
    testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();

    // Submit button should not be disabled because we canceled the submit.
    expect(
      testRenderer.root.findByProps({
        "data-testid": "configure-sideBar-saveChanges",
      }).props.disabled
    ).toBe(true);
    expect(stubCancel.calledOnce).toBe(true);

    window.confirm = stubContinue;
    // Let's enable stream target in local auth.
    testRenderer.root
      .find(inputPredicate("auth.integrations.local.targetFilter.stream"))
      .props.onChange();

    // Send form
    testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();

    expect(stubContinue.calledOnce).toBe(true);
  } finally {
    window.confirm = origConfirm;
  }
});

it("change settings", async () => {
  let settingsRecord = cloneDeep(settingsWithEmptyAuth);
  const { testRenderer } = await createTestRenderer({
    Query: {
      discoverOIDCConfiguration: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          expectAndFail(data).toEqual({ issuer: "http://issuer.com" });
          return {
            issuer: "http://issuer.com",
            tokenURL: "http://issuer.com/tokenURL",
            jwksURI: "http://issuer.com/jwksURI",
            authorizationURL: "http://issuer.com/authorizationURL",
          };
        })
      ),
    },
    Mutation: {
      updateSettings: createSinonStub(
        s =>
          s.onFirstCall().callsFake((_: any, data: any) => {
            expectAndFail(
              data.input.settings.auth.integrations.facebook
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
            settingsRecord = merge(settingsRecord, data.input.settings);
            return {
              settings: settingsRecord,
              clientMutationId: data.input.clientMutationId,
            };
          }),
        s =>
          s.onSecondCall().callsFake((_: any, data: any) => {
            expectAndFail(data.input.settings.auth.integrations.oidc).toEqual({
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
            (settingsRecord.auth.integrations.oidc as any) = merge(
              settingsRecord.auth.integrations.oidc,
              data.input.configuration
            );
            return {
              integration: settingsRecord.auth.integrations.oidc,
              settings: settingsRecord,
              clientMutationId: data.input.clientMutationId,
            };
          })
      ),
    },
  });

  // Let's change some facebook settings.
  testRenderer.root
    .find(inputPredicate("auth.integrations.facebook.enabled"))
    .props.onChange({});
  testRenderer.root
    .find(inputPredicate("auth.integrations.facebook.clientID"))
    .props.onChange("myClientID");
  testRenderer.root
    .find(inputPredicate("auth.integrations.facebook.clientSecret"))
    .props.onChange("myClientSecret");
  expect(
    limitSnapshotTo("configure-auth-facebook-container", testRenderer.toJSON())
  ).toMatchSnapshot("enable facebook configure box");

  // Send form
  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();

  // Submit button should be disabled.
  expect(
    testRenderer.root.findByProps({
      "data-testid": "configure-sideBar-saveChanges",
    }).props.disabled
  ).toBe(true);

  // Disable other fields while submitting
  // We are only testing for one here right now..
  expect(
    testRenderer.root.find(inputPredicate("auth.integrations.facebook.enabled"))
      .props.disabled
  ).toBe(true);
  await timeout();
  expect(
    testRenderer.root.find(inputPredicate("auth.integrations.facebook.enabled"))
      .props.disabled
  ).toBe(false);

  // Now let's enable oidc
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.enabled"))
    .props.onChange({});

  expect(
    limitSnapshotTo("configure-auth-oidc-container", testRenderer.toJSON())
  ).toMatchSnapshot("enable oidc configure box");

  // Try to submit form, this will give validation error messages.
  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();
  expect(
    limitSnapshotTo("configure-auth-oidc-container", testRenderer.toJSON())
  ).toMatchSnapshot("oidc validation errors");

  // Fill form
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.name"))
    .props.onChange("name");
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.clientID"))
    .props.onChange("clientID");
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.clientSecret"))
    .props.onChange("clientSecret");
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.issuer"))
    .props.onChange("http://issuer.com");

  // Discover the rest.
  testRenderer.root
    .find(inputPredicate("configure-auth-oidc-discover"))
    .props.onClick();
  await timeout();

  // Try to submit again, this should work now.
  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();
  expect(
    limitSnapshotTo("configure-auth-oidc-container", testRenderer.toJSON())
  ).toMatchSnapshot("during submit: oidc without errors");

  // Disable other fields while submitting
  // We are only testing for one here right now..
  expect(
    testRenderer.root.find(inputPredicate("auth.integrations.oidc.enabled"))
      .props.disabled
  ).toBe(true);
  await timeout();
  expect(
    testRenderer.root.find(inputPredicate("auth.integrations.oidc.enabled"))
      .props.disabled
  ).toBe(false);
});
