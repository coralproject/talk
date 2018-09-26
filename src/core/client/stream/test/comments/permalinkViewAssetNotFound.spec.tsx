import { ReactTestRenderer } from "react-test-renderer";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import { settings } from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      comment: () => null,
      asset: () => null,
      settings: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined).returns(settings)
      ),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("unknown-asset-id", "assetID");
      localRecord.setValue("unknown-comment-id", "commentID");
    },
  }));
});

it("renders permalink view with unknown asset", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
