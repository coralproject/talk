import { Environment, RecordSource } from "relay-runtime";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import { commit } from "./SetCommentIDMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets comment id", () => {
  const id = "comment1-id";
  commit(environment, { id }, {} as any);
  expect(source.get(LOCAL_ID)!.commentID).toEqual(id);
});

it("Should call setCommentID in pym", async () => {
  const id = "comment2-id";
  const context = {
    pym: {
      sendMessage: sinon
        .mock()
        .once()
        .withArgs("setCommentID", id),
    },
  };
  commit(environment, { id }, context as any);
  await timeout();
  expect(source.get(LOCAL_ID)!.commentID).toEqual(id);
  context.pym.sendMessage.verify();
});

it("Should call setCommentID in pym with empty id", async () => {
  const context = {
    pym: {
      sendMessage: sinon
        .mock()
        .once()
        .withArgs("setCommentID", ""),
    },
  };
  commit(environment, { id: null }, context as any);
  await timeout();
  expect(source.get(LOCAL_ID)!.commentID).toEqual(null);
  context.pym.sendMessage.verify();
});
