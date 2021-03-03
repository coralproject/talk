import { ReactTestRenderer } from "react-test-renderer";

import { pureMerge } from "coral-common/utils";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import { GQLResolver } from "coral-framework/testHelpers/schema";

import {
  settings,
  stories,
  userWithChangedUsername,
  userWithNewUsername,
  viewerPassive,
} from "../fixtures";
import create from "./create";

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
          stream: () => story,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("ACCOUNT", "profileTab");
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
  beforeEach(async () => {
    const setup = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => userWithChangedUsername,
        },
      }),
    });
    testRenderer = setup.testRenderer;
  });

  it("does not allow editing", async () => {
    const changeUsername = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-changeUsername")
    );
    within(changeUsername).getByText("u_changed");
    const editButton = within(changeUsername).getByText("Change");
    act(() => {
      editButton.props.onClick();
    });
    const form = within(changeUsername).queryByType("form");
    const message = within(changeUsername).queryByText(
      "You changed your username within the last 14 days",
      {
        exact: false,
      }
    );
    expect(form).toBeNull();
    expect(message).toBeTruthy();
  });
});

describe("with new username", () => {
  let testRenderer: ReactTestRenderer;
  beforeEach(async () => {
    const setup = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => userWithNewUsername,
        },
      }),
    });
    testRenderer = setup.testRenderer;
  });

  it("shows username change form", async () => {
    const changeUsername = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-changeUsername")
    );

    within(changeUsername).getByText("u_original");
    const editButton = within(changeUsername).getByText("Change");
    act(() => {
      editButton.props.onClick();
    });
    expect(await within(changeUsername).axe()).toHaveNoViolations();
    within(changeUsername).getByType("form");
    const message = within(changeUsername).queryByText(
      "Your username has been changed in the last 14 days",
      {
        exact: false,
      }
    );
    expect(message).toBeNull();
  });
});

describe("change username form", () => {
  let testRenderer: ReactTestRenderer;
  beforeEach(async () => {
    const setup = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => userWithNewUsername,
        },
        Mutation: {
          updateUsername: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              username: "updated_username",
            });
            return {
              user: {
                ...userWithNewUsername,
                username: "updated_username",
              },
            };
          },
        },
      }),
    });
    testRenderer = setup.testRenderer;
  });

  it("ensures username field is required", async () => {
    const changeUsername = within(testRenderer.root).getByTestID(
      "profile-changeUsername"
    );
    const editButton = within(changeUsername).getByText("Change");
    act(() => {
      editButton.props.onClick();
    });
    const form = within(changeUsername).getByType("form");
    act(() => {
      form.props.onSubmit();
    });
    within(changeUsername).getAllByText("This field is required", {
      exact: false,
    });
    const button = within(changeUsername).getByTestID(
      "profile-changeUsername-save"
    );
    expect(button.props.disabled).toBeTruthy();
  });

  it("ensures username confirmation matches", async () => {
    const changeUsername = within(testRenderer.root).getByTestID(
      "profile-changeUsername"
    );
    const editButton = within(changeUsername).getByText("Change");
    act(() => {
      editButton.props.onClick();
    });
    const form = within(changeUsername).getByType("form");
    const username = within(changeUsername).getByTestID(
      "profile-changeUsername-username"
    );
    const usernameConfirm = within(changeUsername).getByTestID(
      "profile-changeUsername-username-confirm"
    );
    act(() => {
      username.props.onChange("testusername");
      usernameConfirm.props.onChange("test");
      form.props.onSubmit();
    });
    within(changeUsername).getByText("Usernames do not match. Try again.", {
      exact: false,
    });
    const button = within(changeUsername).getByTestID(
      "profile-changeUsername-save"
    );
    expect(button.props.disabled).toBeTruthy();
  });

  it("updates username if fields are valid", async () => {
    const changeUsername = within(testRenderer.root).getByTestID(
      "profile-changeUsername"
    );
    const editButton = within(changeUsername).getByText("Change");
    act(() => {
      editButton.props.onClick();
    });
    const form = within(changeUsername).getByType("form");
    const username = within(changeUsername).getByTestID(
      "profile-changeUsername-username"
    );
    const usernameConfirm = within(changeUsername).getByTestID(
      "profile-changeUsername-username-confirm"
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
