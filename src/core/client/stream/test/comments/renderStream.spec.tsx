import { ReactTestRenderer } from "react-test-renderer";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import { assets } from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      asset: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: assets[0].id, url: null })
            .returns(assets[0])
      ),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(assets[0].id, "assetID");
    },
  }));
});

it("renders comment stream", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
