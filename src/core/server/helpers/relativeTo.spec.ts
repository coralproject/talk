import relativeTo from "./relativeTo";

it("strips the leading / from urls", () => {
  expect(
    relativeTo("/root/test", "https://coralproject.net/another/path/")
  ).toEqual("https://coralproject.net/another/path/root/test");
});
