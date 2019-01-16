import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import {
  createSinonStub,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { settings, stories } from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      story: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: stories[0].id, url: null })
            .returns(stories[0])
      ),
      settings: sinon.stub().returns(settings),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  }));
});

it("renders app with comment stream", async () => {
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );
  expect(within(testRenderer.root).toJSON()).toMatchSnapshot();
});
