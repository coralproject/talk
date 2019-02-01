import { VError } from "verror";

import { DuplicateUserError, InternalError, TalkError } from ".";

it("has the right inheritance chain", () => {
  const err = new DuplicateUserError();

  expect(err).toBeInstanceOf(DuplicateUserError);
  expect(err).toBeInstanceOf(TalkError);
  expect(err).toBeInstanceOf(VError);
  expect(err).toBeInstanceOf(Error);

  expect(err.name).toEqual("DuplicateUserError");
});

it("provides an accurate stack", () => {
  const err = new InternalError(
    new Error("this is a test"),
    "this is the reason"
  );

  expect(err).toBeInstanceOf(InternalError);
  expect(err).toBeInstanceOf(TalkError);
  expect(err).toBeInstanceOf(VError);
  expect(err).toBeInstanceOf(Error);
  expect(err.stack).toBeDefined();
});
