import withIOSSafariWidthWorkaround from "./withIOSSafariWidthWorkaround";

it("should set width workaround", () => {
  const fakePym = {
    el: document.createElement("div"),
  };
  fakePym.el.innerHTML = "<span>Hello World</span>";
  withIOSSafariWidthWorkaround(fakePym as any, null as any);
  expect(fakePym.el.innerHTML).toBe(
    '<span style="width: 1px; min-width: 100%;">Hello World</span>'
  );
});
