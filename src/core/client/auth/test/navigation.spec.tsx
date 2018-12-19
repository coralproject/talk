import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { wait, waitForElement, within } from "talk-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

async function createTestRenderer(
  initialView: string
): Promise<ReactTestRenderer> {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
    },
  };
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(initialView, "view");
    },
  });
  return testRenderer;
}

let windowMock: ReturnType<typeof mockWindow>;
beforeEach(() => {
  windowMock = mockWindow();
});

afterEach(async () => {
  await wait(() => expect(windowMock.resizeStub.called).toBe(true));
  windowMock.restore();
});

it("renders sign in form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
});

it("navigates to sign up form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
  within(container)
    .getByTestID("gotoSignUpButton")
    .props.onClick();
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signUp-container")
  );
});

it("navigates to sign in form", async () => {
  const testRenderer = await createTestRenderer("SIGN_UP");
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signUp-container")
  );
  within(container)
    .getByTestID("gotoSignInButton")
    .props.onClick();
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
});

it("navigates to forgot password form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
  within(container)
    .getByTestID("gotoForgotPasswordButton")
    .props.onClick();
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("forgotPassword-container")
  );
});
