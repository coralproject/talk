import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import withSetCommentID from "./withSetCommentID";

let relayEnvironment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  relayEnvironment = createRelayEnvironment({
    source,
  });
});

it("Sets comment id", () => {
  const id = "comment1-id";
  const context = {
    pym: {
      onMessage: (eventName: string, cb: (id: string) => void) => {
        expect(eventName).toBe("setCommentID");
        cb(id);
      },
    },
    relayEnvironment,
  };
  withSetCommentID(context as any);
  expect(source.get(LOCAL_ID)!.commentID).toEqual(id);
});

it("Sets comment id to null when empty", () => {
  const id = "";
  const context = {
    pym: {
      onMessage: (eventName: string, cb: (data: string) => void) => {
        expect(eventName).toBe("setCommentID");
        cb(id);
      },
    },
    relayEnvironment,
  };
  withSetCommentID(context as any);
  expect(source.get(LOCAL_ID)!.commentID).toEqual(null);
});
