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
  withSetCommentID(fakePym as any);
  expect(location.toString()).toBe("http://localhost/?commentID=comment-id");
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
  withSetCommentID(fakePym as any);
  expect(location.toString()).toBe("http://localhost/");
  window.history.replaceState(previousState, document.title, previousLocation);
});
