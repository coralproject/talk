import { USERNAME_REGEX } from "./validate";

describe("USERNAME_REGEX", () => {
  it("validates username characters", () => {
    const usernames = [
      "bill",
      "bill.smith",
      "bill_smith",
      "bill.smith13",
      "áki",
      "åki.smith",
      "åki.smith13",
      "åki_smith",
    ];

    usernames.forEach((username) => {
      expect(USERNAME_REGEX.test(username)).toEqual(true);
    });
  });
});
