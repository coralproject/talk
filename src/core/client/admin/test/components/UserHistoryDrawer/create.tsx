import React from "react";

import { GQLUser } from "coral-framework/schema";
import {
  createTestRenderer as createTestRendererGeneric,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import Harness from "./harness";

export default function create(
  params: CreateTestRendererParams,
  user: GQLUser
) {
  return createTestRendererGeneric("userDrawer", <Harness userID={user.id} />, {
    ...params,
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
