import sinon from "sinon";
import {
  createAuthToken,
  replaceHistoryLocation,
  wait,
} from "talk-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
  users,
} from "../fixtures";

const resolvers = {
  Query: {
    settings: sinon.stub().returns(settings),
    moderationQueues: sinon.stub().returns(emptyModerationQueues),
    comments: sinon.stub().returns(emptyRejectedComments),
    me: sinon.stub().returns(users[0]),
  },
};

it("redirect when already logged in", async () => {
  replaceHistoryLocation("http://localhost/admin/login");
  create({
    resolvers,
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(createAuthToken(), "authToken");
    },
  });
  await wait(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/reported"
    )
  );
});

it("redirect to redirectPath when already logged in", async () => {
  replaceHistoryLocation("http://localhost/admin/login");
  create({
    resolvers,
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(createAuthToken(), "authToken");
      localRecord.setValue("/admin/community", "redirectPath");
    },
  });
  await wait(() =>
    expect(window.location.toString()).toBe("http://localhost/admin/community")
  );
});
