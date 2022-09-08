import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import { GQLCOMMENT_STATUS, GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import {
  featuredTag,
  moderators,
  settings,
  settingsWithMultisite,
  stories,
} from "../../fixtures";
import { createContext } from "../create";

function createStory() {
  const base = stories[0];

  for (const edge of base.comments.edges) {
    const node = edge.node;
    node.story = base;
  }

  return base;
}

const story = createStory();
const firstComment = story.comments.edges[0].node;
const viewer = moderators[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
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
      localRecord.setValue(story.id, "storyID");

      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  customRenderAppWithContext(context);

  return {
    context,
  };
}

it("render moderation view link", async () => {
  await act(async () => {
    await createTestRenderer();
  });

  const comment = await screen.findByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  await act(async () => {
    userEvent.click(caretButton);
  });

  const link = within(comment).getByRole("link", { name: "Moderation view" });
  expect(link).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );
});

it("render moderate story link", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const comment = await screen.findByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  await act(async () => {
    userEvent.click(caretButton);
  });
  const link = within(comment).getByRole("link", { name: "Moderate story" });
  expect(link).toHaveAttribute("href", `/admin/moderate/stories/${story.id}`);
});

it("feature and unfeature comment", async () => {
  await act(async () => {
    await createTestRenderer({
      logNetwork: false,
      resolvers: createResolversStub<GQLResolver>({
        Mutation: {
          featureComment: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              commentID: firstComment.id,
              commentRevisionID: firstComment.revision!.id,
            });
            return {
              comment: pureMerge<typeof firstComment>(firstComment, {
                tags: [featuredTag],
                status: GQLCOMMENT_STATUS.APPROVED,
              }),
            };
          },
          unfeatureComment: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              commentID: firstComment.id,
            });
            return { comment: firstComment };
          },
        },
      }),
    });
  });
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");

  // Feature
  await act(async () => {
    userEvent.click(caretButton);
  });
  const featureButton = within(comment).getByRole("button", {
    name: "Feature",
  });
  fireEvent.click(featureButton);
  expect(within(comment).getByText("Featured")).toBeVisible();
  expect(
    within(screen.getByTestId("comments-featuredCount")).getByText("1")
  ).toBeVisible();

  // Unfeature
  await act(async () => {
    userEvent.click(caretButton);
  });
  const unfeatureButton = within(comment).getByRole("button", {
    name: "Un-feature",
  });
  fireEvent.click(unfeatureButton);
  await waitFor(() => {
    expect(within(comment).queryByText("Featured")).toBeNull();
  });
  expect(
    screen.queryByTestId("comments-featuredCount")
  ).not.toBeInTheDocument();
});

it("approve comment", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Mutation: {
          approveComment: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              commentID: firstComment.id,
              commentRevisionID: firstComment.revision!.id,
            });
            return {
              comment: pureMerge<typeof firstComment>(firstComment, {
                status: GQLCOMMENT_STATUS.APPROVED,
              }),
            };
          },
        },
      }),
    });
  });
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  await act(async () => {
    userEvent.click(caretButton);
  });
  const approveButton = within(comment).getByRole("button", {
    name: "Approve",
  });
  fireEvent.click(approveButton);
  expect(await within(comment).findByText("Approved")).toBeInTheDocument();
});

it("reject comment", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Mutation: {
          rejectComment: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              commentID: firstComment.id,
              commentRevisionID: firstComment.revision!.id,
            });
            return {
              comment: pureMerge<typeof firstComment>(firstComment, {
                status: GQLCOMMENT_STATUS.REJECTED,
              }),
            };
          },
        },
      }),
    });
  });
  const tabPane = await screen.findByTestId("current-tab-pane");
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  userEvent.click(caretButton);
  const rejectButton = within(comment).getByRole("button", { name: "Reject" });
  fireEvent.click(rejectButton);
  expect(
    within(tabPane).getByText("You have rejected this comment.")
  ).toBeVisible();
  const link = within(tabPane).getByRole("link", {
    name: "Go to moderate to review this decision",
  });
  expect(link).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );
});

it("ban user", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          user: ({ variables }) => {
            expectAndFail(variables.id).toBe(firstComment.author!.id);
            return firstComment.author!;
          },
        },
        Mutation: {
          banUser: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              userID: firstComment.author!.id,
              rejectExistingComments: false,
              siteIDs: [],
            });
            return {
              user: pureMerge<typeof firstComment.author>(firstComment.author, {
                status: {
                  ban: {
                    active: true,
                  },
                },
              }),
            };
          },
          rejectComment: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              commentID: firstComment.id,
              commentRevisionID: firstComment.revision!.id,
            });
            return {
              comment: pureMerge<typeof firstComment>(firstComment, {
                status: GQLCOMMENT_STATUS.REJECTED,
              }),
            };
          },
        },
      }),
    });
  });
  const tabPane = await screen.findByTestId("current-tab-pane");
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  await act(async () => {
    userEvent.click(caretButton);
  });
  await waitFor(() => {
    expect(
      within(comment).getByRole("button", { name: "Ban User" })
    ).not.toBeDisabled();
  });
  // this is not multisite, so there should be no Site Ban option
  expect(
    within(comment).queryByRole("button", { name: "Site Ban" })
  ).not.toBeInTheDocument();
  fireEvent.click(within(comment).getByRole("button", { name: "Ban User" }));
  const banButtonDialog = await screen.findByRole("button", { name: "Ban" });
  fireEvent.click(banButtonDialog);
  expect(
    await within(tabPane).findByText("You have rejected this comment.")
  ).toBeVisible();
});

it("cancel ban user", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          user: ({ variables }) => {
            expectAndFail(variables.id).toBe(firstComment.author!.id);
            return firstComment.author!;
          },
        },
      }),
    });
  });
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  await act(async () => {
    userEvent.click(caretButton);
  });
  await waitFor(() => {
    expect(
      within(comment).getByRole("button", { name: "Ban User" })
    ).not.toBeDisabled();
  });
  fireEvent.click(within(comment).getByRole("button", { name: "Ban User" }));
  const cancelButtonDialog = await screen.findByRole("button", {
    name: "Cancel",
  });
  fireEvent.click(cancelButtonDialog);

  expect(
    within(comment).queryByRole("button", { name: "Ban" })
  ).not.toBeInTheDocument();
});

it("site moderator can site ban commenter", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          user: ({ variables }) => {
            expectAndFail(variables.id).toBe(firstComment.author!.id);
            return firstComment.author!;
          },
          settings: () => settingsWithMultisite,
          viewer: () => moderators[1],
        },
        Mutation: {
          banUser: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              userID: firstComment.author!.id,
              rejectExistingComments: false,
              siteIDs: ["site-id"],
            });
            return {
              user: pureMerge<typeof firstComment.author>(firstComment.author, {
                status: {
                  ban: {
                    active: true,
                  },
                },
              }),
            };
          },
          rejectComment: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              commentID: firstComment.id,
              commentRevisionID: firstComment.revision!.id,
            });
            return {
              comment: pureMerge<typeof firstComment>(firstComment, {
                status: GQLCOMMENT_STATUS.REJECTED,
              }),
            };
          },
        },
      }),
    });
  });
  const tabPane = await screen.findByTestId("current-tab-pane");

  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  await act(async () => {
    userEvent.click(caretButton);
  });
  // Site moderator has Site Ban option but not Ban User option
  const siteBanButton = await within(comment).findByRole("button", {
    name: "Site Ban",
  });
  await waitFor(() => {
    expect(siteBanButton).not.toBeDisabled();
  });
  expect(
    within(comment).queryByRole("button", { name: "Ban User" })
  ).not.toBeInTheDocument();
  fireEvent.click(siteBanButton);
  expect(
    await screen.findByText("Ban Markus from this site?")
  ).toBeInTheDocument();

  const banButtonDialog = screen.getByRole("button", { name: "Ban" });
  fireEvent.click(banButtonDialog);
  expect(
    within(tabPane).getByText("You have rejected this comment.")
  ).toBeVisible();
  const link = within(tabPane).getByRole("link", {
    name: "Go to moderate to review this decision",
  });
  expect(link).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );
});
