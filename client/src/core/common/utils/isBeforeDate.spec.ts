import timekeeper from "timekeeper";

import isBeforeDate from "./isBeforeDate";

it("works correctly", () => {
  timekeeper.freeze(new Date("2018-07-06T18:24:00.000Z"));
  expect(isBeforeDate(new Date("2018-07-06T18:24:30.000Z"))).toBe(true);
  expect(isBeforeDate(new Date("2018-07-06T18:23:30.000Z"))).toBe(false);
  timekeeper.reset();
});
