import { Node, Parent } from "unist";
import visit from "unist-util-visit";

import { isNodeParent } from "./helpers";

export default function withNextLinks() {
  return (tree?: Node) => {
    if (!tree || !isNodeParent(tree)) {
      return;
    }

    function visitor(node: Node, index: number, parent?: Parent) {
      if (!parent || !parent.children || !isNodeParent(node)) {
        return;
      }

      if (typeof node.url !== "string" || !node.url.startsWith("/")) {
        return;
      }

      // Ensure that the URL does not have `/docs` as a prefix, that's the job
      // of the <Link /> component.

      let { url } = node;

      if (/^\/docs/.test(url)) {
        // eslint-disable-next-line no-console
        console.warn(
          `Found url using /docs prefix "${node.url}", remove this prefix`
        );

        url = url.replace(/^\/docs/, "");
      }

      parent.children = [
        ...parent.children.slice(0, index),
        {
          type: "jsx",
          value: `<Link href="${url}" passHref><a>`,
        },
        ...node.children,
        { type: "jsx", value: `</a></Link>` },
        ...parent.children.slice(index + 1),
      ];
    }

    visit(tree, "link", visitor);
  };
}
