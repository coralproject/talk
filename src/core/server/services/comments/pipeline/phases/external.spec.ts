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
  it("allows a valid body response", () => {
    expect(validateResponse({ body: "NONE" })).toEqual({ body: "NONE" });
    expect(validateResponse({ body: "APPROVED" })).toEqual({
      body: "APPROVED",
    });
    expect(validateResponse({ body: "REJECTED" })).toEqual({
      body: "REJECTED",
    });
  });
  it("allows a valid tag response", () => {
    expect(validateResponse({ tags: ["FEATURED"] })).toEqual({
      tags: ["FEATURED"],
    });
  });
  it("allows any object as metadata for response", () => {
    expect(
      validateResponse({
        metadata: { this: { is: { a: { deep: "object" } } } },
      })
    ).toEqual({
      metadata: { this: { is: { a: { deep: "object" } } } },
    });
  });
  it("allows and strips unknown fields from the response", () => {
    expect(validateResponse({ willFail: false })).toEqual({});
  });
  it("allows a valid action response", () => {
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
          additionalDetails: "This is additional details",
          metadata: { this: { is: { a: { deep: "object" } } } },
        },
      ],
    });
    expect(
      validateResponse({
        actions: [{ actionType: "FLAG", reason: "COMMENT_DETECTED_SPAM" }],
      })
    ).toEqual({
      actions: [{ actionType: "FLAG", reason: "COMMENT_DETECTED_SPAM" }],
    });
  });
  it("disallows a non-object as metadata for response", () => {
    expect(() => validateResponse({ metadata: 2 })).toThrow();
    expect(() => validateResponse({ metadata: "2" })).toThrow();
    expect(() => validateResponse({ metadata: [2] })).toThrow();
    expect(() => validateResponse({ metadata: ["2"] })).toThrow();
  });
  it("disallows incorrect reasons in the actions from the response", () => {
    expect(
      validateResponse({
        actions: [{ actionType: "FLAG", reason: "COMMENT_DETECTED_NOT_REAL" }],
      })
    ).toEqual({
      actions: [],
    });
    expect(
      validateResponse({
        actions: [
          { actionType: "ALSO_NOT_REAL", reason: "COMMENT_DETECTED_NOT_REAL" },
        ],
      })
    ).toEqual({
      actions: [],
    });
  });
  it("disallows incorrect tag types in the tags from the response", () => {
    expect(validateResponse({ tags: ["NOT_REAL"] })).toEqual({
      tags: [],
    });
    expect(validateResponse({ tags: [""] })).toEqual({ tags: [] });
  });
  it("disallows incorrect values in the status response", () => {
    expect(() => validateResponse({ status: "fail" })).toThrow();
    expect(() => validateResponse({ status: "approved" })).toThrow();
  });
});
