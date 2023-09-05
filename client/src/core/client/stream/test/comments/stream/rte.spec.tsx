import sinon from "sinon";

import { GQLRTEConfiguration } from "coral-framework/schema";
import { act, waitForElement, within } from "coral-framework/testHelpers";
import waitForRTE from "coral-stream/test/helpers/waitForRTE";

import { commenters, settings, stories } from "../../fixtures";
import create from "./create";

async function createTestRenderer(
  resolver: any,
  rteConfig: GQLRTEConfiguration,
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns({
        ...settings,
        rte: rteConfig,
      }),
      viewer: sinon.stub().returns(commenters[0]),
      stream: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables.id).toBe(stories[0].id);
        return stories[0];
      }),
      ...resolver.Query,
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  const rte = await waitForRTE(tabPane, "Post a comment");

  return {
    testRenderer,
    context,
    tabPane,
    rte,
  };
}

it("disabled rte formatting", async () => {
  await act(async () => {
    const { rte } = await createTestRenderer(
      {},
      {
        enabled: false,
        spoiler: true,
        strikethrough: true,
        sarcasm: true,
      }
    );
    expect(within(rte).queryByTitle("Bold")).toBeNull();
    expect(within(rte).queryByTitle("Italic")).toBeNull();
    expect(within(rte).queryByTitle("Blockquote")).toBeNull();
    expect(within(rte).queryByTitle("Bulleted List")).toBeNull();
    expect(within(rte).queryByTitle("Strikethrough")).toBeNull();
    expect(within(rte).queryByTitle("Spoiler")).toBeNull();
    expect(within(rte).queryByTitle("Sarcasm")).toBeNull();
  });
});

it("enable basic rte formatting", async () => {
  await act(async () => {
    const { rte } = await createTestRenderer(
      {},
      {
        enabled: true,
        spoiler: false,
        strikethrough: false,
        sarcasm: false,
      }
    );
    expect(within(rte).queryByTitle("Bold")).not.toBeNull();
    expect(within(rte).queryByTitle("Italic")).not.toBeNull();
    expect(within(rte).queryByTitle("Blockquote")).not.toBeNull();
    expect(within(rte).queryByTitle("Bulleted List")).not.toBeNull();
    expect(within(rte).queryByTitle("Strikethrough")).toBeNull();
    expect(within(rte).queryByTitle("Spoiler")).toBeNull();
    expect(within(rte).queryByTitle("Sarcasm")).toBeNull();
  });
});

it("enable strike formatting", async () => {
  await act(async () => {
    const { rte } = await createTestRenderer(
      {},
      {
        enabled: true,
        strikethrough: true,
        spoiler: false,
        sarcasm: false,
      }
    );
    expect(within(rte).queryByTitle("Bold")).not.toBeNull();
    expect(within(rte).queryByTitle("Italic")).not.toBeNull();
    expect(within(rte).queryByTitle("Blockquote")).not.toBeNull();
    expect(within(rte).queryByTitle("Bulleted List")).not.toBeNull();
    expect(within(rte).queryByTitle("Strikethrough")).not.toBeNull();
    expect(within(rte).queryByTitle("Spoiler")).toBeNull();
    expect(within(rte).queryByTitle("Sarcasm")).toBeNull();
  });
});

it("enable spoiler formatting", async () => {
  await act(async () => {
    const { rte } = await createTestRenderer(
      {},
      {
        enabled: true,
        strikethrough: false,
        spoiler: true,
        sarcasm: false,
      }
    );
    expect(within(rte).queryByTitle("Bold")).not.toBeNull();
    expect(within(rte).queryByTitle("Italic")).not.toBeNull();
    expect(within(rte).queryByTitle("Blockquote")).not.toBeNull();
    expect(within(rte).queryByTitle("Bulleted List")).not.toBeNull();
    expect(within(rte).queryByTitle("Strikethrough")).toBeNull();
    expect(within(rte).queryByText("Spoiler")).not.toBeNull();
    expect(within(rte).queryByTitle("Sarcasm")).toBeNull();
  });
});

it("enable all formatting", async () => {
  await act(async () => {
    const { rte } = await createTestRenderer(
      {},
      {
        enabled: true,
        strikethrough: true,
        spoiler: true,
        sarcasm: true,
      }
    );
    expect(within(rte).queryByTitle("Bold")).not.toBeNull();
    expect(within(rte).queryByTitle("Italic")).not.toBeNull();
    expect(within(rte).queryByTitle("Blockquote")).not.toBeNull();
    expect(within(rte).queryByTitle("Bulleted List")).not.toBeNull();
    expect(within(rte).queryByTitle("Strikethrough")).not.toBeNull();
    expect(within(rte).queryByText("Spoiler")).not.toBeNull();
    expect(within(rte).queryByText("Sarcasm")).not.toBeNull();
  });
});
