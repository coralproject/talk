import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import create from "./create";
import { settings } from "./fixtures";

async function createTestRenderer(
  initialView: string
): Promise<ReactTestRenderer> {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
    },
  };
  const windowMock = sinon.mock(window);
  windowMock.expects("resizeTo");
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(initialView, "view");
    },
  });
  await timeout();
  windowMock.restore();
  return testRenderer;
}

it("renders sign in form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("navigates to sign up form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  testRenderer.root
    .findByProps({ id: "signIn-gotoSignUpButton" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("navigates to sign in form", async () => {
  const testRenderer = await createTestRenderer("SIGN_UP");
  testRenderer.root
    .findByProps({ id: "signUp-gotoSignInButton" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("navigates to forgot password form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  testRenderer.root
    .findByProps({ id: "signIn-gotoForgotPasswordButton" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
