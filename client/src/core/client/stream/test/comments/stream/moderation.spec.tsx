import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ERROR_CODES } from "coral-common/common/lib/errors";
import { pureMerge } from "coral-common/common/lib/utils";
import { InvalidRequestError } from "coral-framework/lib/errors";
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
const thirdComment = story.comments.edges[2].node;
const viewer = moderators[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {},
  options: { muteNetworkErrors?: boolean } = {}
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
    muteNetworkErrors: options.muteNetworkErrors,
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

  const link = within(comment).getByRole("link", {
    name: "Moderation view share-external-link-1",
  });
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
  const link = within(comment).getByRole("link", {
    name: "Moderate story share-external-link-1",
  });
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
    name: "Go to moderate to review this decision share-external-link-1",
  });
  expect(link).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );
});

it("spam ban user", async () => {
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
              rejectExistingComments: true,
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
      within(comment).getByRole("button", { name: "Spam ban" })
    ).not.toBeDisabled();
  });
  // this is not multisite, so there should be no Site Ban option
  expect(
    within(comment).queryByRole("button", { name: "Site ban" })
  ).not.toBeInTheDocument();
  fireEvent.click(within(comment).getByRole("button", { name: "Spam ban" }));

  const banButtonDialog = await screen.findByRole("button", { name: "Ban" });

  // Ban button should be disabled at first
  expect(banButtonDialog).toBeDisabled();

  // Spam ban option includes all details
  expect(
    screen.getByText("Ban this account from the comments")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Reject all comments written by this account")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Only for use on obvious spam accounts")
  ).toBeInTheDocument();
  expect(screen.getByText("For more context, go to")).toBeInTheDocument();
  const moderationViewLink = screen.getByRole("link", {
    name: "Moderation view",
  });
  expect(moderationViewLink).toBeInTheDocument();
  expect(moderationViewLink).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );

  const input = screen.getByTestId("userSpamBanConfirmation");
  fireEvent.change(input, { target: { value: "spam" } });

  // After "spam" is typed in, Ban button should be enabled
  await waitFor(() => {
    expect(banButtonDialog).toBeEnabled();
  });

  fireEvent.click(banButtonDialog);
  expect(
    await within(tabPane).findByText("You have rejected this comment.")
  ).toBeVisible();

  // spam ban confirmation should be shown
  expect(screen.getByText("Markus is now banned")).toBeInTheDocument();
  expect(
    screen.getByText(
      "This account can no longer comment, use reactions, or report comments"
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText("All comments by this account have been rejected")
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "You can still review this account's history by searching in Coral's"
    )
  ).toBeInTheDocument();
  const communityLink = screen.getByRole("link", { name: "Community section" });
  expect(communityLink).toBeInTheDocument();
  expect(communityLink).toHaveAttribute("href", "/admin/community");
  const closeButton = screen.getByRole("button", { name: "Close" });
  fireEvent.click(closeButton);

  // spam ban comfirmation should no longer be shown after Close button clicked
  expect(screen.queryByText("Markus is now banned")).toBeNull();
  expect(screen.queryByText("You have rejected this comment.")).toBeDefined();
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
      within(comment).getByRole("button", { name: "Spam ban" })
    ).not.toBeDisabled();
  });
  fireEvent.click(within(comment).getByRole("button", { name: "Spam ban" }));
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
  // Site moderator has Site Ban option
  const siteBanButton = await within(comment).findByRole("button", {
    name: "Site ban",
  });
  await waitFor(() => {
    expect(siteBanButton).not.toBeDisabled();
  });
  // Site moderator also has Spam ban option
  expect(
    within(comment).queryByRole("button", { name: "Spam ban" })
  ).toBeInTheDocument();
  fireEvent.click(siteBanButton);
  expect(
    await screen.findByText("Ban Markus from this site?")
  ).toBeInTheDocument();

  const banButtonDialog = screen.getByRole("button", { name: "Ban" });
  fireEvent.click(banButtonDialog);
  await waitFor(() => {
    expect(
      within(tabPane).getByText("You have rejected this comment.")
    ).toBeVisible();
  });

  const link = await within(tabPane).findByRole("link", {
    name: "Go to moderate to review this decision share-external-link-1",
  });
  expect(link).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );
});

it("site moderator can spam ban commenter", async () => {
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
              rejectExistingComments: true,
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
  // Site moderator has Spam ban option
  const spamBanButton = await within(comment).findByRole("button", {
    name: "Spam ban",
  });
  fireEvent.click(spamBanButton);

  const input = screen.getByTestId("userSpamBanConfirmation");
  fireEvent.change(input, { target: { value: "spam" } });

  const banButtonDialog = screen.getByRole("button", { name: "Ban" });
  fireEvent.click(banButtonDialog);
  await waitFor(() => {
    expect(
      within(tabPane).getByText("You have rejected this comment.")
    ).toBeVisible();
  });

  expect(screen.getByText("Markus is now banned")).toBeInTheDocument();

  const link = await within(tabPane).findByRole("link", {
    name: "Go to moderate to review this decision share-external-link-1",
  });
  expect(link).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );
});

it("site moderator cannot ban another moderator with site privileges", async () => {
  const errorCode = ERROR_CODES.MODERATOR_CANNOT_BE_BANNED_ON_SITE;
  await act(async () => {
    await createTestRenderer(
      {
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            user: () => {
              return moderators[2];
            },
            settings: () => settingsWithMultisite,
            viewer: () => moderators[1],
          },
          Mutation: {
            banUser: ({ variables }) => {
              expectAndFail(variables).toMatchObject({
                userID: thirdComment.author?.id,
                rejectExistingComments: true,
                siteIDs: ["site-id"],
              });
              throw new InvalidRequestError({
                code: errorCode,
                param: "input.body",
                traceID: "traceID",
              });
            },
            rejectComment: ({ variables }) => {
              expectAndFail(variables).toMatchObject({
                commentID: thirdComment.id,
                commentRevisionID: thirdComment.revision?.id,
              });
              return {
                comment: pureMerge<typeof thirdComment>(thirdComment, {
                  status: GQLCOMMENT_STATUS.REJECTED,
                }),
              };
            },
          },
        }),
      },
      { muteNetworkErrors: true }
    );
  });

  const comment = screen.getByTestId(`comment-${thirdComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  await act(async () => {
    userEvent.click(caretButton);
  });
  // Site moderator has Spam ban option
  const spamBanButton = await within(comment).findByRole("button", {
    name: "Spam ban",
  });
  fireEvent.click(spamBanButton);

  const input = screen.getByTestId("userSpamBanConfirmation");
  fireEvent.change(input, { target: { value: "spam" } });

  const banButtonDialog = screen.getByRole("button", { name: "Ban" });
  fireEvent.click(banButtonDialog);
  expect(await screen.findByText(errorCode)).toBeInTheDocument();
});

it("can copy comment embed code", async () => {
  const jsdomPrompt = window.prompt;
  window.prompt = jest.fn(() => null);

  await act(async () => {
    await createTestRenderer();
  });

  const comment = await screen.findByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  await act(async () => {
    userEvent.click(caretButton);
  });

  const embedCodeButton = within(comment).getByRole("button", {
    name: "Embed code",
  });

  fireEvent.click(embedCodeButton);
  expect(
    within(comment).getByRole("button", { name: "Code copied" })
  ).toBeDefined();
  window.prompt = jsdomPrompt;
});

it.only("requires rection reason when dsaFeaturesEnabled", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Mutation: {
          rejectComment: ({ variables }) => {
            expectAndFail(variables).toMatchObject({
              commentID: firstComment.id,
              commentRevisionID: firstComment.revision!.id,
              reason: {
                code: "OTHER",
                additionalInfo: "really weird comment tbh",
              },
            });
            return {
              comment: pureMerge<typeof firstComment>(firstComment, {
                status: GQLCOMMENT_STATUS.REJECTED,
              }),
            };
          },
        },
      }),
      initLocalState(local, source, environment) {
        local.setValue(true, "dsaFeaturesEnabled");
      },
    });
  });
  // const tabPane = await screen.findByTestId("current-tab-pane");
  const comment = screen.getByTestId(`comment-${firstComment.id}`);

  const caretButton = within(comment).getByLabelText("Moderate");

  await act(async () => userEvent.click(caretButton));

  const rejectButton = within(comment).getByRole("button", { name: "Reject" });

  await act(async () => {
    fireEvent.click(rejectButton);
  });

  await waitFor(() => {
    expect(screen.queryByTestId("moderation-reason-modal")).toBeInTheDocument();
  });

  const reasonModal = await within(comment).findByTestId(
    "moderation-reason-modal"
  );

  expect(reasonModal).toBeInTheDocument();

  const submitReasonButton = within(reasonModal).getByRole("button", {
    name: "Submit",
  });
  expect(submitReasonButton).toBeDisabled();

  const otherOption = within(reasonModal).getByLabelText("other", {
    exact: false,
  });

  expect(otherOption).toBeInTheDocument();

  act(() => {
    fireEvent.click(otherOption);
  });

  const additionalInfo = within(reasonModal).getByTestId(
    "moderation-reason-additiona-info"
  );
  act(() => {
    fireEvent.change(additionalInfo, {
      target: { value: "really weird comment tbh" },
    });
  });

  expect(submitReasonButton).toBeEnabled();

  act(() => {
    fireEvent.click(submitReasonButton);
  });
});
