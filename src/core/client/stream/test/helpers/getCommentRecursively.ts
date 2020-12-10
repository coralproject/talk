import { GQLComment, GQLCommentsConnection } from "coral-framework/schema";

/**
 * Finds comment recursively inside of connection.
 */
function findComment(
  connection: GQLCommentsConnection,
  id: string
): GQLComment | null {
  for (const edge of connection.edges) {
    if (edge.node.id === id) {
      return edge.node;
    }
    const found = findComment(edge.node.replies, id);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Finds comment recursively inside of connection.
 * Throws if it doesn't exist.
 */
export default function getCommentRecursively(
  connection: GQLCommentsConnection,
  id: string
): GQLComment {
  const comment = findComment(connection, id);
  if (!comment) {
    throw new Error(
      `Comment with id ${id} was not found inside given Connection`
    );
  }
  return comment;
}
