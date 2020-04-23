import { validateResponse } from "./external";

describe("validateResponse", () => {
  it("allows an empty response", () => {
    expect(validateResponse({})).toEqual({});
  });
  it("allows a valid status response", () => {
    expect(validateResponse({ status: "NONE" })).toEqual({ status: "NONE" });
    expect(validateResponse({ status: "APPROVED" })).toEqual({
      status: "APPROVED",
    });
    expect(validateResponse({ status: "REJECTED" })).toEqual({
      status: "REJECTED",
    });
    expect(validateResponse({ status: "SYSTEM_WITHHELD" })).toEqual({
      status: "SYSTEM_WITHHELD",
    });
  });
  it("allows a valid tag response", () => {
    expect(validateResponse({ tags: ["FEATURED"] })).toEqual({
      tags: ["FEATURED"],
    });
    expect(validateResponse({ tags: ["STAFF"] })).toEqual({
      tags: ["STAFF"],
    });
  });
  it("allows and strips unknown fields from the response", () => {
    expect(validateResponse({ willFail: false })).toEqual({});
  });
  it("allows a valid action response", () => {
    expect(
      validateResponse({
        actions: [{ actionType: "FLAG", reason: "COMMENT_DETECTED_SPAM" }],
      })
    ).toEqual({
      actions: [{ actionType: "FLAG", reason: "COMMENT_DETECTED_SPAM" }],
    });
  });
  it("allows a valid action response and filters undefined fields", () => {
    expect(
      validateResponse({
        actions: [
          {
            actionType: "FLAG",
            reason: "COMMENT_DETECTED_TOXIC",
            additionalDetails: "This is additional details",
            metadata: { this: { is: { a: { deep: "object" } } } },
          },
        ],
      })
    ).toEqual({
      actions: [
        {
          actionType: "FLAG",
          reason: "COMMENT_DETECTED_TOXIC",
        },
      ],
    });
  });
  it("disallows incorrect reasons in the actions from the response", () => {
    expect(() =>
      validateResponse({
        actions: [{ actionType: "FLAG", reason: "COMMENT_DETECTED_NOT_REAL" }],
      })
    ).toThrow();
    expect(() =>
      validateResponse({
        actions: [
          { actionType: "ALSO_NOT_REAL", reason: "COMMENT_DETECTED_NOT_REAL" },
        ],
      })
    ).toThrow();
  });
  it("disallows incorrect tag types in the tags from the response", () => {
    expect(() => validateResponse({ tags: ["NOT_REAL"] })).toThrow();
    expect(() => validateResponse({ tags: [""] })).toThrow();
  });
  it("disallows incorrect values in the status response", () => {
    expect(() => validateResponse({ status: "fail" })).toThrow();
    expect(() => validateResponse({ status: "approved" })).toThrow();
  });
});
