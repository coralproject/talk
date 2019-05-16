import { dotize } from "coral-common/utils/dotize";

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

it("converts array properties when enabled", () => {
  const input = {
    a: [
      { property: "with", an: "array" },
      { value: [{ sometimes: "nested" }] },
    ],
    other: { times: "not" },
  };
  const output = dotize(input);

  expect(output).toEqual({
    "a[0].property": "with",
    "a[0].an": "array",
    "a[1].value[0].sometimes": "nested",
    "other.times": "not",
  });
});

it("does not converts array properties when disabled", () => {
  const input = {
    a: [
      { property: "with", an: "array" },
      { value: [{ sometimes: "nested" }] },
    ],
    other: { times: "not" },
  };
  const output = dotize(input, { ignoreArrays: true });

  expect(output).toEqual({
    "other.times": "not",
  });
});

it("does convert array properties properly", () => {
  expect(
    dotize({ wordlist: { banned: ["banned"] } }, { embedArrays: true })
  ).toEqual({
    "wordlist.banned": ["banned"],
  });
});
