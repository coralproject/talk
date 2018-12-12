import { cloneDeep, get, merge } from "lodash";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import {
  createSinonStub,
  inputPredicate,
  limitSnapshotTo,
  replaceHistoryLocation,
} from "talk-framework/testHelpers";

import create from "../create";
import { settings } from "../fixtures";

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
        .returns(merge({}, settings, get(resolver, "Query.settings"))),
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
  await timeout();
  return testRenderer;
};

it("renders configure auth", async () => {
  const testRenderer = await createTestRenderer();
  expect(
    limitSnapshotTo("configure-container", testRenderer.toJSON())
  ).toMatchSnapshot();
});

it("regenerate sso key", async () => {
  const testRenderer = await createTestRenderer({
    Mutation: {
      regenerateSSOKey: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          return {
            settings: {
              auth: {
                integrations: {
                  sso: {
                    key: "==GENERATED_KEY==",
                    keyGeneratedAt: "2018-11-12T23:26:06.239Z",
                  },
                },
              },
            },
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
  const testRenderer = await createTestRenderer();

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
  let settingsRecord = cloneDeep(settings);
  const testRenderer = await createTestRenderer({
    Mutation: {
      updateSettings: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          expect(data.input.settings.auth.integrations.local).toEqual({
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
        "data-test": "configure-sideBar-saveChanges",
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
  let settingsRecord = cloneDeep(settings);
  const testRenderer = await createTestRenderer({
    Query: {
      discoverOIDCConfiguration: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          expect(data).toEqual({ issuer: "http://issuer.com" });
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
      updateSettings: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          expect(data.input.settings.auth.integrations.facebook).toEqual({
            enabled: true,
            allowRegistration: true,
            targetFilter: {
              admin: true,
              stream: true,
            },
            clientID: "myClientID",
            clientSecret: "myClientSecret",
          });
          settingsRecord = merge({}, settingsRecord, data.input.settings);
          return {
            settings: settingsRecord,
            clientMutationId: data.input.clientMutationId,
          };
        })
      ),
      createOIDCAuthIntegration: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          expect(data.input.configuration).toEqual({
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
          (settingsRecord.auth.integrations.oidc as any).push({
            id: "generatedID",
            enabled: false,
            callbackURL: "http://localhost/oidc/callback",
            ...data.input.configuration,
          });
          return {
            settings: settingsRecord,
            clientMutationId: data.input.clientMutationId,
          };
        })
      ),
      updateOIDCAuthIntegration: createSinonStub(s =>
        s.callsFake((_: any, data: any) => {
          expect(data.input.configuration).toEqual({
            enabled: true,
            allowRegistration: false,
            targetFilter: {
              admin: true,
              stream: true,
            },
            name: "name",
            clientID: "clientID",
            clientSecret: "clientSecret2",
            issuer: "http://issuer.com",
            jwksURI: "http://issuer.com/jwksURI",
            authorizationURL: "http://issuer.com/authorizationURL",
            tokenURL: "http://issuer.com/tokenURL",
          });
          (settingsRecord.auth.integrations.oidc[0] as any) = merge(
            {},
            settingsRecord.auth.integrations.oidc[0],
            data.input.configuration
          );
          return {
            integration: settingsRecord.auth.integrations.oidc[0],
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

  // Send form, this will perform creating an initial oidc record and update settings.
  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();

  // Submit button should be disabled.
  expect(
    testRenderer.root.findByProps({
      "data-test": "configure-sideBar-saveChanges",
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
    .find(inputPredicate("auth.integrations.oidc.0.enabled"))
    .props.onChange({});

  expect(
    limitSnapshotTo("configure-auth-oidc-container-0", testRenderer.toJSON())
  ).toMatchSnapshot("enable oidc configure box");

  // Try to submit form, this will give validation error messages.
  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();
  expect(
    limitSnapshotTo("configure-auth-oidc-container-0", testRenderer.toJSON())
  ).toMatchSnapshot("oidc validation errors");

  // Fill form
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.0.name"))
    .props.onChange("name");
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.0.clientID"))
    .props.onChange("clientID");
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.0.clientSecret"))
    .props.onChange("clientSecret");
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.0.issuer"))
    .props.onChange("http://issuer.com");

  // Discover the rest.
  testRenderer.root
    .find(inputPredicate("configure-auth-oidc-discover-0"))
    .props.onClick();
  await timeout();

  // Try to submit again, this should work now.
  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();
  expect(
    limitSnapshotTo("configure-auth-oidc-container-0", testRenderer.toJSON())
  ).toMatchSnapshot("during submit: oidc without errors");

  // Disable other fields while submitting
  // We are only testing for one here right now..
  expect(
    testRenderer.root.find(inputPredicate("auth.integrations.oidc.0.enabled"))
      .props.disabled
  ).toBe(true);
  await timeout();
  expect(
    testRenderer.root.find(inputPredicate("auth.integrations.oidc.0.enabled"))
      .props.disabled
  ).toBe(false);

  // Change clientSecret
  testRenderer.root
    .find(inputPredicate("auth.integrations.oidc.0.clientSecret"))
    .props.onChange("clientSecret2");

  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();

  // Disable other fields while submitting
  // We are only testing for one here right now..
  expect(
    testRenderer.root.find(inputPredicate("auth.integrations.oidc.0.enabled"))
      .props.disabled
  ).toBe(true);
  await timeout();
  expect(
    testRenderer.root.find(inputPredicate("auth.integrations.oidc.0.enabled"))
      .props.disabled
  ).toBe(false);
});
