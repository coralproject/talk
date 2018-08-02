import withAutoHeight from "./withAutoHeight";

it("should set height", () => {
  const fakePym = {
    onMessage: (type: string, callback: (height: string) => void) => {
      expect(type).toBe("height");
      callback("100");
    },
    el: document.createElement("div"),
  };
  fakePym.el.innerHTML = "<span>Hello World </span>";
  withAutoHeight(fakePym as any);
  expect(fakePym.el.innerHTML).toBe(
    '<span style="height: 100px;">Hello World </span>'
  );
});
