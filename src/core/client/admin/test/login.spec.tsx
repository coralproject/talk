import { ReactTestInstance, ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext } from "talk-framework/lib/bootstrap";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { replaceHistoryLocation } from "talk-framework/testHelpers";

import create from "./create";

const inputPredicate = (name: string) => (n: ReactTestInstance) => {
  return n.props.name === name && n.props.onChange;
};

let context: TalkContext;
let testRenderer: ReactTestRenderer;
let form: ReactTestInstance;
beforeEach(async () => {
  // deliberately setting to a different route,
  // it should be smart enough to reroute to /admin/login.
  replaceHistoryLocation("http://localhost/admin/moderate");

  ({ testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(false, "loggedIn");
    },
  }));
  await timeout();
  form = testRenderer.root.findByType("form");
});

it("renders sign in form", async () => {
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for invalid email", async () => {
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "invalid-email" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts valid email", async () => {
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "hans@test.com" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts correct password", async () => {
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "testtest" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows server error", async () => {
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "hans@test.com" } });
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "testtest" } });

  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local", {
      method: "POST",
      body: {
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .throws(error);

  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  restMock.verify();
});

it("submits form successfully", async () => {
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "hans@test.com" } });
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "testtest" } });

  const authToken = `${btoa(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    })
  )}.${btoa(
    JSON.stringify({
      jti: "31b26591-4e9a-4388-a7ff-e1bdc5d97cce",
    })
  )}`;

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local", {
      method: "POST",
      body: {
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .returns({ token: authToken });

  const historyMock = sinon.mock(window.history);

  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  restMock.verify();
  await timeout();
  expect(
    context.relayEnvironment
      .getStore()
      .getSource()
      .get(LOCAL_ID)!.loggedIn
  ).toBeTruthy();
  await timeout();
  historyMock.verify();
});
