import { dotize } from "coral-common/utils/dotize";

it("converts nested properties", () => {
  const input = {
    a: "property",
    can: { be: "nested", really: { deeply: "sometimes" } },
  };
  const output = dotize(input);

  expect(output).toStrictEqual({
    a: "property",
    "can.be": "nested",
    "can.really.deeply": "sometimes",
  });
});

it("converts properties with dates", () => {
  const now = new Date();
  const input = { a: now, can: { be: now } };
  const output = dotize(input);

  expect(output).toStrictEqual({
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

  expect(output).toStrictEqual({
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

  expect(output).toStrictEqual({
    "other.times": "not",
  });
});

it("does convert array properties properly", () => {
  expect(
    dotize({ wordlist: { banned: ["banned"] } }, { embedArrays: true })
  ).toStrictEqual({
    "wordlist.banned": ["banned"],
  });
});

it("does exclude undefined properties by default", () => {
  expect(dotize({ test: { is: undefined, a: 1 } })).toStrictEqual({
    "test.a": 1,
  });
});

it("does include undefined properties when requested", () => {
  expect(
    dotize({ test: { is: undefined, a: 1 } }, { includeUndefined: true })
  ).toStrictEqual({
    "test.a": 1,
    "test.is": undefined,
  });
});
