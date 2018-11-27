import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import { calculateCountsDiff } from "./counts";

it("allows transition from NONE to ACCEPTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.NONE, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.ACCEPTED, actionCounts: {} }
    )
  ).toEqual({
    total: -1,
    queues: {
      reported: 0,
      pending: 0,
      unmoderated: -1,
    },
  });
});

it("allows transition from NONE to REJECTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.NONE, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.REJECTED, actionCounts: {} }
    )
  ).toEqual({
    total: -1,
    queues: {
      reported: 0,
      pending: 0,
      unmoderated: -1,
    },
  });
});

it("allows transition from NONE to FLAGGED*", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.NONE, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.NONE, actionCounts: { FLAG: 1 } }
    )
  ).toEqual({
    total: 0,
    queues: {
      reported: 1,
      pending: 0,
      unmoderated: 0,
    },
  });
});

it("allows transition from FLAGGED* to ACCEPTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.NONE, actionCounts: { FLAG: 1 } },
      { status: GQLCOMMENT_STATUS.ACCEPTED, actionCounts: { FLAG: 1 } }
    )
  ).toEqual({
    total: -1,
    queues: {
      reported: -1,
      pending: 0,
      unmoderated: -1,
    },
  });
});

it("allows transition from FLAGGED* to REJECTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.NONE, actionCounts: { FLAG: 1 } },
      { status: GQLCOMMENT_STATUS.REJECTED, actionCounts: { FLAG: 1 } }
    )
  ).toEqual({
    total: -1,
    queues: {
      reported: -1,
      pending: 0,
      unmoderated: -1,
    },
  });
});

it("allows transition from PREMOD to ACCEPTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.PREMOD, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.ACCEPTED, actionCounts: {} }
    )
  ).toEqual({
    total: -1,
    queues: {
      reported: 0,
      pending: -1,
      unmoderated: -1,
    },
  });
});

it("allows transition from PREMOD to REJECTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.PREMOD, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.REJECTED, actionCounts: {} }
    )
  ).toEqual({
    total: -1,
    queues: {
      reported: 0,
      pending: -1,
      unmoderated: -1,
    },
  });
});

it("allows transition from SYSTEM_WITHHELD to ACCEPTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.ACCEPTED, actionCounts: {} }
    )
  ).toEqual({
    total: -1,
    queues: {
      reported: 0,
      pending: -1,
      unmoderated: -1,
    },
  });
});

it("allows transition from SYSTEM_WITHHELD to REJECTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.REJECTED, actionCounts: {} }
    )
  ).toEqual({
    total: -1,
    queues: {
      reported: 0,
      pending: -1,
      unmoderated: -1,
    },
  });
});

it("allows transition from ACCEPTED to REJECTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.ACCEPTED, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.REJECTED, actionCounts: {} }
    )
  ).toEqual({
    total: 0,
    queues: {
      reported: 0,
      pending: 0,
      unmoderated: 0,
    },
  });
});

it("allows transition from REJECTED to ACCEPTED", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.REJECTED, actionCounts: {} },
      { status: GQLCOMMENT_STATUS.ACCEPTED, actionCounts: {} }
    )
  ).toEqual({
    total: 0,
    queues: {
      reported: 0,
      pending: 0,
      unmoderated: 0,
    },
  });
});

it("allows no transition once a comment has been flagged more than once", () => {
  expect(
    calculateCountsDiff(
      { status: GQLCOMMENT_STATUS.NONE, actionCounts: { FLAG: 1 } },
      { status: GQLCOMMENT_STATUS.NONE, actionCounts: { FLAG: 2 } }
    )
  ).toEqual({
    total: 0,
    queues: {
      reported: 0,
      pending: 0,
      unmoderated: 0,
    },
  });
});
