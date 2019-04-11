import React from "react";

import EntryContainer from "talk-admin/containers/EntryContainer";
import { GQLResolver } from "talk-framework/schema";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "talk-framework/testHelpers";

export default function create(params: CreateTestRendererParams<GQLResolver>) {
  return createTestRenderer<GQLResolver>("admin", <EntryContainer />, params);
}
