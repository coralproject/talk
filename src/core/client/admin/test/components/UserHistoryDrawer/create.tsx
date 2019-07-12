import React from "react";

import UserHistoryDrawerContainer from "coral-admin/components/UserHistoryDrawer/UserHistoryDrawerContainer";
import { GQLUser } from "coral-framework/schema";
import {
  createTestRenderer as createTestRendererGeneric,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

export default function create(
  params: CreateTestRendererParams,
  user: GQLUser
) {
  return createTestRendererGeneric(
    "userDrawer",
    <UserHistoryDrawerContainer
      userID={user.id}
      open
      onClose={() => {
        return;
      }}
    />,
    {
      ...params,
      initLocalState: (localRecord, source, environment) => {
        if (params.initLocalState) {
          params.initLocalState(localRecord, source, environment);
        }
      },
    }
  );
}
