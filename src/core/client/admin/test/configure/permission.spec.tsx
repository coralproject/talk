import { get, merge } from "lodash";
import sinon from "sinon";

import { GQLUSER_ROLE } from "talk-framework/schema";
import {
  replaceHistoryLocation,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { settings, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/general");
});

const createTestRenderer = async (
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) => {
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
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
    },
  });
  return {
    testRenderer,
  };
};

it("denies access to moderators", async () => {
  const deniedRoles = [GQLUSER_ROLE.MODERATOR];
  for (const r of deniedRoles) {
    const { testRenderer } = await createTestRenderer({
      Query: {
        viewer: sinon.stub().returns({ ...users.admins[0], role: r }),
      },
    });
    await waitForElement(() =>
      within(testRenderer.root).getByText("Sign in with a different account")
    );
  }
});

it("allows access to admins", async () => {
  const deniedRoles = [GQLUSER_ROLE.ADMIN];
  for (const r of deniedRoles) {
    const { testRenderer } = await createTestRenderer({
      Query: {
        viewer: sinon.stub().returns({ ...users.admins[0], role: r }),
      },
    });
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("configure-container")
    );
  }
});
