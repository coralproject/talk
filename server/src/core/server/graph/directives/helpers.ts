import { GraphQLResolveInfo, ResponsePath } from "graphql";

/**
 * calculateLocationKey will reduce the resolve information to determine the
 * path to where the key that is being accessed.
 *
 * @param info the info from the graph request
 */
export function calculateLocationKey(
  info: Pick<GraphQLResolveInfo, "path" | "operation" | "parentType">
): string {
  // Guard against invalid input.
  if (!info || !info.path || !info.path.key) {
    return "";
  }

  // Grab the first part of the path.
  const parts: string[] = [info.path.key.toString()];

  // Grab the parent previous part of the path.
  let prev: ResponsePath | undefined = info.path.prev;

  // While there is still a previous part of the path, keep looping to find the
  // all the parts.
  while (prev && prev.key) {
    // Push the key into the front of the array.
    parts.unshift(prev.key.toString());

    // Change the selection to the previous path element.
    prev = prev.prev;
  }

  // Join it together with a dotted path.
  return parts.join(".");
}
