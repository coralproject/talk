import { MOD_QUEUE_SORT_ORDER } from "coral-admin/constants";
import { GQLCOMMENT_SORT } from "coral-framework/schema";

export const getQueueOrderBy = () => {
  const initialOrderBy =
    (localStorage.getItem(
      `coral:${MOD_QUEUE_SORT_ORDER}`
    ) as GQLCOMMENT_SORT) || GQLCOMMENT_SORT.CREATED_AT_DESC;

  return initialOrderBy;
};
