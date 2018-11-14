import { get, merge } from "lodash";
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
        .returns(merge(settings, get(resolver, "Query.settings"))),
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

it("change facebook settings", async () => {
  const testRenderer = await createTestRenderer({
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
          return {
            settings: merge(settings, data.input.settings),
            clientMutationId: data.input.clientMutationId,
          };
        })
      ),
    },
  });
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

  // Send form.
  testRenderer.root.findByProps({ id: "configure-form" }).props.onSubmit();

  // Disabled submit button
  expect(
    testRenderer.root.find(inputPredicate("configure-sideBar-saveChanges"))
      .props.disabled
  ).toBe(true);

  // Disable other fields
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
