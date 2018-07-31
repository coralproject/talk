import { dotize } from "talk-common/utils/dotize";

it("converts nested properties", () => {
  const input = {
    a: "property",
    can: { be: "nested", really: { deeply: "sometimes" } },
  };
  const output = dotize(input);

  expect(output).toEqual({
    a: "property",
    "can.be": "nested",
    "can.really.deeply": "sometimes",
  });
});

it("converts properties with dates", () => {
  const now = new Date();
  const input = { a: now, can: { be: now } };
  const output = dotize(input);

  expect(output).toEqual({
    a: now,
    "can.be": now,
  });
});

it("errors when an array is included", () => {
  expect(() => dotize({ an: { array: [1, 2, 3] } })).toThrowError();
});
