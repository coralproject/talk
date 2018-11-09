import { timeout } from "talk-common/utils";
import { replaceHistoryLocation } from "talk-framework/testHelpers";

import create from "./create";

it("redirect when already logged in", async () => {
  replaceHistoryLocation("http://localhost/admin/login");
  create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
    },
  });
  await timeout();
  expect(window.location.toString()).toBe("http://localhost/admin/moderate");
});

it("redirect to redirectPath when already logged in", async () => {
  replaceHistoryLocation("http://localhost/admin/login");
  create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue("/admin/community", "redirectPath");
    },
  });
  await timeout();
  expect(window.location.toString()).toBe("http://localhost/admin/community");
});
