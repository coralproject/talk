import { get, merge } from "lodash";
import sinon from "sinon";

import {
  toJSON,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

let windowMock: ReturnType<typeof mockWindow>;

async function createTestRenderer(customResolver: any = {}) {
  const resolvers = {
    ...customResolver,
    Query: {
      ...customResolver.Query,
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(customResolver, "Query.settings"))),
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("ADD_EMAIL_ADDRESS", "view");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("addEmailAddress-container")
  );
  const main = within(testRenderer.root).getByTestID(/.*-main/);
  const form = within(main).queryByType("form");

  return {
    context,
    testRenderer,
    form,
    main,
    root: testRenderer.root,
    container,
  };
}

beforeEach(async () => {
  windowMock = mockWindow();
});

afterEach(async () => {
  await wait(() => expect(windowMock.resizeStub.called).toBe(true));
  windowMock.restore();
});

it("renders sign in view", async () => {
  const { root } = await createTestRenderer();
  expect(toJSON(root)).toMatchSnapshot();
});
