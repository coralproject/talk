import { act, screen } from "@testing-library/react";

import { pureMerge } from "coral-common/utils";
import { GQLResolver, GQLSettings, GQLStory } from "coral-framework/schema";

import {
  baseStory,
  commenters,
  commentFromMember,
  commentFromModerator,
  commentsFromStaff,
  settings,
} from "../../fixtures";

import {
  createFixture,
  createResolversStub,
  CreateTestRendererParams,
  denormalizeStory,
} from "coral-framework/testHelpers";

import createContext from "../create";

import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

const storyWithBadgeComments = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "test",
      comments: {
        edges: [
          {
            node: commentFromMember,
            cursor: commentFromMember.createdAt,
          },
          {
            node: commentsFromStaff[0],
            cursor: commentsFromStaff[0].createdAt,
          },
          {
            node: commentFromModerator,
            cursor: commentFromModerator.createdAt,
          },
        ],
      },
    },
    baseStory
  )
);

describe("user badges", () => {
  const uniqueLabels = {
    memberLabel: "MEMBER",
    staffLabel: "STAFF",
    moderatorLabel: "MODERATOR",
  };
  async function createTestRenderer(params: CreateTestRendererParams) {
    const { context } = createContext({
      ...params,
      resolvers: pureMerge(
        createResolversStub<GQLResolver>({
          Query: {
            settings: () =>
              pureMerge<GQLSettings>(settings, {
                badges: uniqueLabels,
              }),
            viewer: () => commenters[0],
          },
        }),
        params.resolvers
      ),
      initLocalState: (localRecord, source, environment) => {
        if (params.initLocalState) {
          params.initLocalState(localRecord, source, environment);
        }
      },
    });

    customRenderAppWithContext(context);

    return context;
  }

  it("renders user badges", async () => {
    const resolvers = createResolversStub<GQLResolver>({
      Query: {
        stream: ({ variables, ...rest }) => {
          return storyWithBadgeComments;
        },
      },
    });
    await act(async () => {
      await createTestRenderer({
        resolvers,
      });
    });

    const memberBadge = await screen.findByText(uniqueLabels.memberLabel);
    const staffBadge = await screen.findByText(uniqueLabels.staffLabel);
    const moderatorBadge = await screen.findByText(uniqueLabels.moderatorLabel);

    expect(memberBadge).toBeDefined();
    expect(staffBadge).toBeDefined();
    expect(moderatorBadge).toBeDefined();
  });
});
