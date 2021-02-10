import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import { Environment, RecordSource } from "relay-runtime";

import { parseQuery } from "coral-common/utils";
import { LOCAL_ID } from "coral-framework/lib/relay";
import { createRelayEnvironment } from "coral-framework/testHelpers";

import { OnPymSetCommentID } from "./OnPymSetCommentID";

let relayEnvironment: Environment;
const source: RecordSource = new RecordSource();

const previousLocation = location.toString();
const previousState = window.history.state;

beforeAll(() => {
  relayEnvironment = createRelayEnvironment({
    source,
  });
});

afterEach(() => {
  // As history will change after the listener triggers, reset this to before.
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("Sets comment id", () => {
  const id = "comment1-id";
  const props = {
    pym: {
      onMessage: (eventName: string, cb: (id: string) => void) => {
        expect(eventName).toBe("setCommentID");
        cb(id);
      },
    } as any,
    relayEnvironment,
    window,
  };
  createRenderer().render(<OnPymSetCommentID {...props} />);
  expect(source.get(LOCAL_ID)!.commentID).toEqual(id);
  expect(parseQuery(location.search).commentID).toEqual(id);
});

it("Sets comment id to null when empty", () => {
  const id = "";
  const props = {
    pym: {
      onMessage: (eventName: string, cb: (data: string) => void) => {
        expect(eventName).toBe("setCommentID");
        cb(id);
      },
    } as any,
    relayEnvironment,
    window,
  };
  createRenderer().render(<OnPymSetCommentID {...props} />);
  expect(source.get(LOCAL_ID)!.commentID).toEqual(null);
  expect(parseQuery(location.search).commentID).toBeUndefined();
});
