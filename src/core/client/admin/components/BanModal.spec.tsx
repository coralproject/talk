import React from "react";

import { act, render } from "@testing-library/react";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import { pureMerge } from "coral-common/utils";
import { CoralContextProvider } from "coral-framework/lib/bootstrap";
import { GQLResolver, GQLUSER_ROLE } from "coral-framework/schema";

import { createContext } from "../test/create";
import customRenderAppWithContext from "../test/customRenderAppWithContext";

import {
  // settings,
  users,
  // site,
} from "../test/fixtures";

import BanModal from "./BanModal";

const commenter = users.commenters[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver>
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Mutation: {
          updateUserBan: ({ variables }) => {
            return {};
          },
          banUser: ({ variables }) => {
            return {};
          },
          createEmailDomain: ({ variables }) => {
            return {};
          },
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environmenet) => {},
  });

  customRenderAppWithContext(context);

  return context;
}

afterEach(jest.clearAllMocks);

it("creates domain ban for unmoderated domain while updating user ban status", async () => {
  const context = await createTestRenderer({});

  await act(async () => {
    render(
      <CoralContextProvider value={context}>
        <BanModal
          userID={commenter.id}
          username={commenter.username || null}
          userEmail={commenter.email || null}
          open={true}
          onClose={() => null} // TODO: spy
          onConfirm={() => null} // ditto
          viewerScopes={{
            role: GQLUSER_ROLE.MODERATOR,
          }}
          emailDomainModeration={[]}
          userRole={commenter.role}
          isMultisite={false}
        />
      </CoralContextProvider>
    );
  });
});
