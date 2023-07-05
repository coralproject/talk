import { Environment, RecordSource } from "relay-runtime";
import sinon from "sinon";

import { waitFor } from "coral-common/helpers";
import { parseQuery } from "coral-common/utils";
import { LOCAL_ID } from "coral-framework/lib/relay";
import { createRelayEnvironment } from "coral-framework/testHelpers";

import { commit } from "./SetCommentIDMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

const previousLocation = location.toString();
const previousState = window.history.state;

afterEach(() => {
  // As history will change after the listener triggers, reset this to before.
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("Sets comment id", async () => {
  const id = "comment1-id";
  const context = {
    window,
    renderWindow: window,
  };
  await commit(environment, { id }, context as any);
  expect(source.get(LOCAL_ID)!.commentID).toEqual(id);
});

it("Should call setCommentID in eventEmitter", async () => {
  const id = "comment2-id";
  const context = {
    eventEmitter: {
      emit: sinon.mock().once().withArgs("stream.setCommentID", id),
    },
    window,
    renderWindow: window,
  };
  await commit(environment, { id }, context as any);
  await waitFor();
  expect(source.get(LOCAL_ID)!.commentID).toEqual(id);
  context.eventEmitter.emit.verify();
});

it("Should call setCommentID in eventEmitter with empty id", async () => {
  const context = {
    eventEmitter: {
      emit: sinon.mock().once().withArgs("stream.setCommentID", ""),
    },
    window,
    renderWindow: window,
  };
  await commit(environment, { id: null }, context as any);
  await waitFor();
  expect(source.get(LOCAL_ID)!.commentID).toEqual(null);
  expect(parseQuery(location.search).commentID).toBeUndefined();
  context.eventEmitter.emit.verify();
});
