import { GQLCOMMENT_SORT_RL } from "coral-framework/schema";

export type COMMENTS_TAB =
  | "NONE"
  | "ALL_COMMENTS"
  | "FEATURED_COMMENTS"
  | "QUESTIONS"
  | "REVIEWS"
  | "UNANSWERED_COMMENTS"
  | "%future added value";

export type ACTIVE_TAB =
  | "COMMENTS"
  | "PROFILE"
  | "DISCUSSIONS"
  | "%future added value";

export type COMMENT_SORT = GQLCOMMENT_SORT_RL;

export type AUTH_VIEW =
  | "FORGOT_PASSWORD"
  | "SIGN_IN"
  | "SIGN_UP"
  | "%future added value";
