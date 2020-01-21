import {
  GQLCOMMENT_FLAG_REASON,
  GQLFlagReasonActionCounts,
} from "coral-server/graph/schema/__generated__/types";

type ExtractKeys<T> = { [P in keyof T]: P }[keyof T];
type A = ExtractKeys<typeof GQLCOMMENT_FLAG_REASON>;
type B = ExtractKeys<GQLFlagReasonActionCounts>;

// These tests ensure that the enums contained in GQLCOMMENT_FLAG_REASON are
// also defined on the GQLFlagReasonActionCounts type.
describe("GQLFlagReasonActionCounts", () => {
  it("contains all the flag enum types", () => {
    const a: A = "" as any;
    let b: B = "" as any;
    b = a;
    expect(b).toBe("");

    let c: A = "" as any;
    const d: B = "" as any;
    c = d;
    expect(c).toBe("");
  });
});
