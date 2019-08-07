import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  waitUntilThrow,
  within,
} from "coral-framework/testHelpers";

import {
  baseUser,
  commenters,
  settings,
  settingsWithoutLocalAuth,
  stories,
  viewerPassive,
} from "../fixtures";
import create from "./create";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const weekago = new Date();
weekago.setDate(yesterday.getDate() - 7);
const viewerNew = {
  ...viewerPassive,
  username: "original",
  status: {
    ...viewerPassive.status,
    username: {
      history: [
        {
          username: "original",
          createdAt: yesterday.toISOString(),
          createdBy: viewerPassive.id,
        },
      ],
    },
  },
};

const viewerPreviouslyUpdated = {
  ...viewerPassive,
  username: "recentlyChanged",
  status: {
    ...viewerPassive.status,
    username: {
      history: [
        {
          username: "recentlyChanged",
          createdAt: yesterday.toISOString(),
          createdBy: viewerPassive.id,
        },
        {
          username: "original",
          createdAt: weekago.toISOString(),
          createdBy: viewerPassive.id,
        },
      ],
    },
  },
};

const story = stories[0];
const viewer = viewerPassive;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          story: () => story,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("SETTINGS", "profileTab");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  return {
    testRenderer,
    context,
  };
}

describe("with recently changed username", () => {
  let testRenderer: ReactTestRenderer;
  let changeUsername;
  beforeEach(async () => {
    const setup = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => viewerPreviouslyUpdated,
        },
      }),
    });
    testRenderer = setup.testRenderer;
    changeUsername = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-changeUsername")
    );
  });

  it("displays current username", () => {
    within(changeUsername).getByText("recentlyChanged");
  });

  it("doesn't show the change username form", async () => {
    const editButton = within(changeUsername).getByText("Edit");
    act(() => {
      editButton.props.onClick();
    });
    const form = within(changeUsername).queryByType("form");
    expect(form).toBeNull();
  });

  it("Shows message explaining that username cannot be edited", async () => {
    const editButton = within(changeUsername).getByText("Edit");
    act(() => {
      editButton.props.onClick();
    });
    const message = within(changeUsername).queryByText(
      "Your username has been changed in the last 14 days",
      { exact: false }
    );
    expect(message).toBeTruthy();
  });
});

describe("with new username", () => {
  let testRenderer: ReactTestRenderer;
  let changeUsername;
  beforeEach(async () => {
    const setup = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => viewerNew,
        },
      }),
    });
    testRenderer = setup.testRenderer;
    changeUsername = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-changeUsername")
    );
  });

  it("displays current username", () => {
    within(changeUsername).getByText("original");
  });

  it("shows the change username form", async () => {
    const editButton = within(changeUsername).getByText("Edit");
    act(() => {
      editButton.props.onClick();
    });
    within(changeUsername).getByType("form");
  });

  it("does not show message explaining that username cannot be edited", async () => {
    const editButton = within(changeUsername).getByText("Edit");
    act(() => {
      editButton.props.onClick();
    });
    const message = within(changeUsername).queryByText(
      "Your username has been changed in the last 14 days",
      { exact: false }
    );
    expect(message).toBeNull();
  });
});

describe("change username form", () => {
  let testRenderer: ReactTestRenderer;
  let changeUsername;
  beforeEach(async () => {
    const setup = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => viewerNew,
        },
        Mutation: {
          updateUsername: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              username: "updated_username",
            });
            return {
              user: {
                ...viewerNew,
                username: "updated_username",
              },
            };
          },
        },
      }),
    });
    testRenderer = setup.testRenderer;
    changeUsername = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-changeUsername")
    );
    const editButton = within(changeUsername).getByText("Edit");
    act(() => {
      editButton.props.onClick();
    });
  });

  it("ensures username field is required", async () => {
    const form = within(changeUsername).queryByType("form");
    act(() => {
      form.props.onSubmit();
    });
    within(changeUsername).getAllByText("This field is required", {
      exact: false,
    });
    const button = within(changeUsername).getByText("Save");
    expect(button.props.disabled).toBeTruthy();
  });

  it("ensures username confirmation matches", async () => {
    const form = within(changeUsername).queryByType("form");
    const username = within(changeUsername).getByLabelText("New username");
    const usernameConfirm = within(changeUsername).getByLabelText(
      "Confirm new username"
    );
    act(() => {
      username.props.onChange("testusername");
      usernameConfirm.props.onChange("test");
      form.props.onSubmit();
    });
    within(changeUsername).getByText("Usernames do not match. Try again.", {
      exact: false,
    });
    const button = within(changeUsername).getByText("Save");
    expect(button.props.disabled).toBeTruthy();
  });

  it("updates username if fields are valid", async () => {
    const form = within(changeUsername).queryByType("form");
    const username = within(changeUsername).getByLabelText("New username");
    const usernameConfirm = within(changeUsername).getByLabelText(
      "Confirm new username"
    );
    await act(async () => {
      username.props.onChange("updated_username");
      usernameConfirm.props.onChange("updated_username");
      await form.props.onSubmit();
    });

    within(changeUsername).getByText(
      "Your username has been successfully updated"
    );
  });
});
