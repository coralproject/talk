import simulant from "simulant";
import sinon from "sinon";

import { CleanupCallback } from "./";
import withSetCommentID from "./withSetCommentID";

it("should add commentID", () => {
  const previousLocation = location.toString();
  const previousState = window.history.state;
  const fakePym = {
    onMessage: (type: string, callback: (id: string) => void) => {
      if (type === "setCommentID") {
        callback("comment-id");
      }
    },
  };
  const cleanup = withSetCommentID(
    fakePym as any,
    null as any
  ) as CleanupCallback;
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
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      if (type === "setCommentID") {
        callback();
      }
    },
  };
  const cleanup = withSetCommentID(
    fakePym as any,
    null as any
  ) as CleanupCallback;
  expect(location.toString()).toBe("http://localhost/");
  cleanup();
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("should send commentID over pym when history changes", () => {
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    "http://localhost/?commentID=comment-id"
  );
  const fakePym = {
    onMessage: sinon.stub(),
    sendMessage: sinon.mock().once().withArgs("setCommentID", "comment-id"),
  };
  const cleanup = withSetCommentID(
    fakePym as any,
    null as any
  ) as CleanupCallback;
  simulant.fire(window as any, "popstate");
  cleanup();
  simulant.fire(window as any, "popstate");
  fakePym.sendMessage.verify();
  window.history.replaceState(previousState, document.title, previousLocation);
});
