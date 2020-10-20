import { parse, stringify } from "./json";

it("stringify values with dates", () => {
  const data = {
    date: new Date("2020-10-19T18:35:31.151Z"),
    array: [
      { date: new Date("2020-10-19T18:35:31.152Z") },
      { date: new Date("2020-10-19T18:35:31.153Z") },
      { date: new Date("2020-10-19T18:35:31.154Z") },
    ],
  };

  const stringified = stringify(data);

  expect(stringified).toMatchSnapshot();
});

it("parse values with dates", () => {
  const data = '{ "date": { "$date": "2020-10-19T18:35:31.151Z" } }';

  const parsed = parse(data);

  expect(parsed).toMatchSnapshot();
});

it("can parse what's stringified", () => {
  const data = { date: new Date("2020-10-19T18:35:31.151Z") };

  const parsed = parse(stringify(data));

  expect(parsed).toEqual(data);
});
