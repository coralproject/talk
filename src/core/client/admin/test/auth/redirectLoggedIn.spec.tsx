import sinon from "sinon";
import {
  createAccessToken,
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
    viewer: sinon.stub().returns(users.admins[0]),
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
      localRecord.setValue(createAccessToken(), "accessToken");
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
      localRecord.setValue(createAccessToken(), "accessToken");
      localRecord.setValue("/admin/moderate/pending", "redirectPath");
    },
  });
  await wait(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/pending"
    )
  );
});
