import { Node, Parent } from "unist";

export function isNodeParent(node: Node | Parent): node is Parent {
  return (node as Parent).children && Array.isArray(node.children);
}
