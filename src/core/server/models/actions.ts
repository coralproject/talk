import {
  GQLACTION_ITEM_TYPE,
  GQLACTION_TYPE,
} from "talk-server/graph/tenant/schema/__generated__/types";

export type ActionCounts = Record<string, number>;

export interface Action {
  readonly id: string;
  action_type: GQLACTION_TYPE;
  item_type: GQLACTION_ITEM_TYPE;
  item_id: string;
  group_id?: string;
  user_id?: string;
  created_at: Date;
  metadata?: Record<string, any>;
}
