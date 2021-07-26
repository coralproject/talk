export const FlattenRepliesIndentLevel = 4 as const;

export const replyIsFlattened = (
  flattenedRepliesEnabled?: boolean | null,
  indentLevel?: number | null
) => {
  return (
    flattenedRepliesEnabled &&
    indentLevel &&
    indentLevel >= FlattenRepliesIndentLevel
  );
};
