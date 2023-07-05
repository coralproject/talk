import { MAX_REPLY_INDENT_DEPTH } from "coral-stream/constants";

export const isReplyFlattened = (
  flattenedRepliesEnabled?: boolean | null,
  indentLevel?: number | null
) => {
  return (
    flattenedRepliesEnabled &&
    indentLevel &&
    indentLevel >= MAX_REPLY_INDENT_DEPTH
  );
};
