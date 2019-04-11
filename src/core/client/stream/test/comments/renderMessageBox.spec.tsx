import sinon from "sinon";

import { pureMerge } from "talk-common/utils";
import { waitForElement, within } from "talk-framework/testHelpers";

import { commenters, settings, storyWithNoComments } from "../fixtures";
import create from "./create";

async function createTestRenderer(
  data: {
    story?: any;
    settings?: any;
    loggedIn?: boolean;
  } = {},
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(pureMerge(settings, data.settings)),
      viewer: sinon.stub().returns((data.loggedIn && commenters[0]) || null),
      story: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables.id).toBe(storyWithNoComments.id);
        return pureMerge(storyWithNoComments, data.story);
      }),
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(storyWithNoComments.id, "storyID");
      localRecord.setValue(Boolean(data.loggedIn), "loggedIn");
    },
  });

  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  return {
    testRenderer,
    context,
    tabPane,
  };
}

it("renders message box when not logged in", async () => {
  const { tabPane } = await createTestRenderer({
    story: {
      settings: {
        messageBox: {
          enabled: true,
          icon: "chat",
          content: "**What do you think**?",
        },
      },
    },
  });
  expect(within(tabPane).toJSON()).toMatchSnapshot();
});

it("renders message box when logged in", async () => {
  const { tabPane } = await createTestRenderer({
    story: {
      settings: {
        messageBox: {
          enabled: true,
          icon: "chat",
          content: "**What do you think**?",
        },
      },
    },
    loggedIn: true,
  });
  expect(within(tabPane).toJSON()).toMatchSnapshot();
});

it("renders message box when commenting disabled", async () => {
  const { tabPane } = await createTestRenderer({
    story: {
      settings: {
        messageBox: {
          enabled: true,
          icon: "chat",
          content: "**What do you think**?",
        },
      },
    },
    settings: {
      disableCommenting: {
        enabled: true,
        message: "Commenting disabled",
      },
    },
  });
  expect(within(tabPane).toJSON()).toMatchSnapshot();
});

it("renders message box when story isClosed", async () => {
  const { tabPane } = await createTestRenderer({
    story: {
      isClosed: true,
      settings: {
        messageBox: {
          enabled: true,
          icon: null,
          content: "**What do you think**?",
        },
      },
    },
  });
  expect(within(tabPane).toJSON()).toMatchSnapshot();
});
