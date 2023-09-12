import simulant from "simulant";
import sinon from "sinon";

import withSetCommentID from "./withSetCommentID";

it("should add commentID", () => {
  const previousLocation = location.toString();
  const previousState = window.history.state;
  const fakeStreamEventEmitter = {
    on: (eventName: string, callback: (id: string) => void) => {
      if (eventName === "stream.setCommentID") {
        callback("comment-id");
      }
    },
  };
  const cleanup = withSetCommentID(fakeStreamEventEmitter as any);
  expect(location.toString()).toBe("http://localhost/?commentID=comment-id");
  cleanup();
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("should remove commentID", () => {
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    "http://localhost/?commentID=comment-id"
  );
  const fakeStreamEventEmitter = {
    on: (eventName: string, callback: () => void) => {
      if (eventName === "stream.setCommentID") {
        callback();
      }
    },
  };
  const cleanup = withSetCommentID(fakeStreamEventEmitter as any);
  expect(location.toString()).toBe("http://localhost/");
  cleanup();
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("should send commentID over eventEmitter when history changes", () => {
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    "http://localhost/?commentID=comment-id"
  );
  const fakeEventEmitter = {
    on: sinon.stub(),
    emit: sinon.mock().once().withArgs("embed.setCommentID", "comment-id"),
  };
  const cleanup = withSetCommentID(fakeEventEmitter as any);
  simulant.fire(window as any, "popstate");
  cleanup();
  simulant.fire(window as any, "popstate");
  fakeEventEmitter.emit.verify();
  window.history.replaceState(previousState, document.title, previousLocation);
});
