import { cloneDeep } from "lodash";

import { waitFor } from "coral-common/helpers";
import {
  createInMemoryStorage,
  createPromisifiedStorage,
} from "coral-framework/lib/storage";
import { wait } from "coral-framework/testHelpers";

import {
  CommentSeenDB,
  KEEP_DURATION_DAYS,
  KEEP_ITEM_COUNT,
} from "./CommentSeenContext";

const storyIDs = ["s1", "s2"];
const viewerIDs = ["v1", "v2"];
const commentIDs = ["c1", "c2"];

it("marks comment as seen and returns all seen comments", async () => {
  const storage = createInMemoryStorage();
  const commentSeen = new CommentSeenDB(createPromisifiedStorage(storage));
  commentSeen.markSeen(storyIDs[0], viewerIDs[0], commentIDs[0]);
  commentSeen.markSeen(storyIDs[1], viewerIDs[0], commentIDs[0]);
  commentSeen.markSeen(storyIDs[1], viewerIDs[0], commentIDs[1]);
  commentSeen.markSeen(storyIDs[1], viewerIDs[1], commentIDs[0]);
  await wait(async () =>
    expect(
      await commentSeen.getAllSeenComments(storyIDs[0], viewerIDs[0])
    ).toEqual({
      [commentIDs[0]]: 1,
    })
  );
  await wait(async () =>
    expect(
      await commentSeen.getAllSeenComments(storyIDs[1], viewerIDs[0])
    ).toEqual({
      [commentIDs[0]]: 1,
      [commentIDs[1]]: 1,
    })
  );
  await wait(async () =>
    expect(
      await commentSeen.getAllSeenComments(storyIDs[1], viewerIDs[1])
    ).toEqual({
      [commentIDs[0]]: 1,
    })
  );
  const meta = storage.getItem("meta");
  expect(meta[`${viewerIDs[0]}:${storyIDs[0]}`].count).toBe(1);
  expect(
    meta[`${viewerIDs[0]}:${storyIDs[0]}`].timestamp > Date.now() - 10000
  ).toBe(true);
  expect(meta[`${viewerIDs[0]}:${storyIDs[1]}`].count).toBe(2);
  expect(
    meta[`${viewerIDs[0]}:${storyIDs[1]}`].timestamp > Date.now() - 10000
  ).toBe(true);
  expect(meta[`${viewerIDs[1]}:${storyIDs[1]}`].count).toBe(1);
  expect(
    meta[`${viewerIDs[1]}:${storyIDs[1]}`].timestamp > Date.now() - 10000
  ).toBe(true);
});

it("updates timestamp on `getAllSeenComments`", async () => {
  const storage = createInMemoryStorage();
  const commentSeen = new CommentSeenDB(createPromisifiedStorage(storage));
  const now = Date.now();
  commentSeen.markSeen(storyIDs[0], viewerIDs[0], commentIDs[0]);
  await wait(() => expect(storage.getItem("meta")).toBeTruthy());
  const meta = storage.getItem("meta");
  const timestamp = meta[`${viewerIDs[0]}:${storyIDs[0]}`].timestamp;
  expect(timestamp).toBeGreaterThanOrEqual(now);
  const waitPeriod = 100;
  await waitFor(waitPeriod);
  await commentSeen.getAllSeenComments(storyIDs[0], viewerIDs[0]);
  await wait(() =>
    expect(
      storage.getItem("meta")[`${viewerIDs[0]}:${storyIDs[0]}`].timestamp
    ).toBeGreaterThanOrEqual(now + waitPeriod)
  );
});

it("clears old data due to age", async () => {
  const data = {
    [`${viewerIDs[0]}:${storyIDs[0]}`]: {
      [commentIDs[0]]: 1,
    },
    [`${viewerIDs[0]}:${storyIDs[1]}`]: {
      [commentIDs[0]]: 1,
    },
    meta: {
      [`${viewerIDs[0]}:${storyIDs[0]}`]: {
        count: 1,
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * KEEP_DURATION_DAYS * 2,
      },
      [`${viewerIDs[0]}:${storyIDs[1]}`]: {
        count: 1,
        timestamp: Date.now(),
      },
    },
  };
  const originalData = cloneDeep(data);
  const storage = createInMemoryStorage<any>(data);
  new CommentSeenDB(createPromisifiedStorage(storage));
  await wait(() => expect(Object.keys(data.meta).length).toBe(1));
  expect(data).toStrictEqual({
    [`${viewerIDs[0]}:${storyIDs[1]}`]: originalData[
      `${viewerIDs[0]}:${storyIDs[1]}`
    ],
    meta: {
      [`${viewerIDs[0]}:${storyIDs[1]}`]: originalData.meta[
        `${viewerIDs[0]}:${storyIDs[1]}`
      ],
    },
  });
});

it("clears old data when passing threshold", async () => {
  const data = {
    [`${viewerIDs[0]}:${storyIDs[0]}`]: {},
    [`${viewerIDs[0]}:${storyIDs[1]}`]: {},
    [`${viewerIDs[1]}:${storyIDs[0]}`]: {},
    [`${viewerIDs[1]}:${storyIDs[1]}`]: {},
    meta: {
      [`${viewerIDs[0]}:${storyIDs[0]}`]: {
        count: KEEP_ITEM_COUNT / 3,
        timestamp: Date.now() - 10,
      },
      [`${viewerIDs[0]}:${storyIDs[1]}`]: {
        count: KEEP_ITEM_COUNT / 3,
        timestamp: Date.now() - 12,
      },
      [`${viewerIDs[1]}:${storyIDs[0]}`]: {
        count: KEEP_ITEM_COUNT / 3,
        timestamp: Date.now() - 8,
      },
      [`${viewerIDs[1]}:${storyIDs[1]}`]: {
        count: KEEP_ITEM_COUNT / 3,
        timestamp: Date.now() - 5,
      },
    },
  };
  const originalData = cloneDeep(data);
  const storage = createInMemoryStorage<any>(data);
  new CommentSeenDB(createPromisifiedStorage(storage));
  await wait(() => expect(Object.keys(data.meta).length).toBe(2));
  expect(data).toStrictEqual({
    [`${viewerIDs[1]}:${storyIDs[0]}`]: originalData[
      `${viewerIDs[1]}:${storyIDs[0]}`
    ],
    [`${viewerIDs[1]}:${storyIDs[1]}`]: originalData[
      `${viewerIDs[1]}:${storyIDs[1]}`
    ],
    meta: {
      [`${viewerIDs[1]}:${storyIDs[0]}`]: originalData.meta[
        `${viewerIDs[1]}:${storyIDs[0]}`
      ],
      [`${viewerIDs[1]}:${storyIDs[1]}`]: originalData.meta[
        `${viewerIDs[1]}:${storyIDs[1]}`
      ],
    },
  });
});
