import { filterSuperseded, SupersededNotification } from "./messages";

describe("filterSuperseded", () => {
  it("handles when there is no superseded notifications", () => {
    const notifications: SupersededNotification[] = [
      {
        category: { name: "staffReply", supersedesCategories: ["reply"] },
        notification: { userID: "1" },
      },
      {
        category: { name: "staffReply", supersedesCategories: ["reply"] },
        notification: { userID: "1" },
      },
      {
        category: { name: "staffReply", supersedesCategories: ["reply"] },
        notification: { userID: "2" },
      },
    ];
    expect(notifications.filter(filterSuperseded)).toHaveLength(3);
  });

  it("handles when there is superseded notifications", () => {
    const notifications: SupersededNotification[] = [
      {
        category: { name: "staffReply", supersedesCategories: ["reply"] },
        notification: { userID: "1" },
      },
      {
        category: { name: "staffReply", supersedesCategories: ["reply"] },
        notification: { userID: "1" },
      },
      {
        category: { name: "reply", supersedesCategories: [] },
        notification: { userID: "1" },
      },
      {
        category: { name: "reply", supersedesCategories: [] },
        notification: { userID: "2" },
      },
    ];
    expect(notifications.filter(filterSuperseded)).toHaveLength(3);
  });
});
