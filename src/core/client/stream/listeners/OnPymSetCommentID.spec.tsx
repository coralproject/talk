import { shallow } from "enzyme";
import React from "react";
import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import { OnPymSetCommentID } from "./OnPymSetCommentID";

let relayEnvironment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  relayEnvironment = createRelayEnvironment({
    source,
  });
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
  };
  shallow(<OnPymSetCommentID {...props} />);
  expect(source.get(LOCAL_ID)!.commentID).toEqual(id);
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
  };
  shallow(<OnPymSetCommentID {...props} />);
  expect(source.get(LOCAL_ID)!.commentID).toEqual(null);
});
