import withCommentID from "./withCommentID";

it("should add commentID", () => {
  const previousLocation = location.toString();
  const previousState = window.history.state;
  const fakePym = {
    onMessage: (type: string, callback: (id: string) => void) => {
      if (type === "view-comment") {
        callback("comment-id");
      }
    },
  };
  withCommentID(fakePym as any);
  expect(location.toString()).toBe("http://localhost/?commentId=comment-id");
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("should remove commentID", () => {
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    "http://localhost/?commentId=comment-id"
  );
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      if (type === "view-all-comments") {
        callback();
      }
    },
  };
  withCommentID(fakePym as any);
  expect(location.toString()).toBe("http://localhost/");
  window.history.replaceState(previousState, document.title, previousLocation);
});
