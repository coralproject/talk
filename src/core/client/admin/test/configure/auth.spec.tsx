import { merge } from "lodash";
import { ReactTestRenderer } from "react-test-renderer";
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

let testRenderer: ReactTestRenderer;
beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/configure/auth");

  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
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
          return {
            settings: merge(settings, data.input.settings),
            clientMutationId: data.input.clientMutationId,
          };
        })
      ),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
    },
  }));
  await timeout();
});

it("renders configure auth", async () => {
  expect(
    limitSnapshotTo("configure-container", testRenderer.toJSON())
  ).toMatchSnapshot();
});

it("change settings", async () => {
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
