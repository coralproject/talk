import withAutoHeight from "./withAutoHeight";

it("should set height", () => {
  const fakePym = {
    onMessage: (type: string, callback: (height: string) => void) => {
      expect(type).toBe("height");
      callback("100");
    },
    iframe: document.createElement("iframe"),
  };
  withAutoHeight(fakePym as any);
});
