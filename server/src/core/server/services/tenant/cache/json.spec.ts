import { parse, stringify } from "./json";

const createInput = () => ({
  date: new Date("2020-10-19T18:35:31.151Z"),
  shouldTransform: [
    { date: new Date("2020-10-19T18:35:31.152Z") },
    { date: new Date("2020-10-19T18:35:31.153Z") },
    { date: new Date("2020-10-19T18:35:31.154Z") },
  ],
  shouldNotTransform: [
    "2020-10-19T18:35:31.155Z",
    "2020-10-19T18:35:31.156Z",
    "2020-10-19T18:35:31.157Z",
  ],
  thingWithNull: null,
  thingWithBool: [true, false],
  thingWithNumbers: [1, 2, 3],
});

it("can parse what's stringified", () => {
  const input = createInput();
  const parsed = parse(stringify(input));

  expect(parsed).toEqual(input);
});
