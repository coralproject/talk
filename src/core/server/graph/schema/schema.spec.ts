import {
  GQLCOMMENT_FLAG_REASON,
  GQLFlagReasonActionCounts,
} from "coral-server/graph/schema/__generated__/types";

type ExtractKeys<T> = { [P in keyof T]: P }[keyof T];
type FlagReasonKey = ExtractKeys<typeof GQLCOMMENT_FLAG_REASON>;
type FlagReasonActionCountKey = ExtractKeys<GQLFlagReasonActionCounts>;

// These tests ensure that the enums contained in GQLCOMMENT_FLAG_REASON are
// also defined on the GQLFlagReasonActionCounts type.
describe("GQLFlagReasonActionCounts", () => {
  it("contains all the flag enum types", () => {
    const a: FlagReasonKey = "" as any;
    let b: FlagReasonActionCountKey = "" as any;
    b = a;
    expect(b).toBe("");

    let c: FlagReasonKey = "" as any;
    const d: FlagReasonActionCountKey = "" as any;
    c = d;
    expect(c).toBe("");
  });
});
