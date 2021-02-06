import fs from "fs";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";
import path from "path";

import MDXComponents from "../components/MDXComponents";
import withNextLinks from "../remark/withNextLinks";

const rootPath = path.join(process.cwd(), "docs", "__generated__", "reference");

import introspection from "../__generated__/introspection.json";

export function getReferences() {
  return introspection.__schema.types.filter(
    ({ name }) => !name.startsWith("__")
  );
}

export interface Reference {
  pagePath: string;
  mdxSource: MdxRemote.Source;
  frontMatter: {
    title: string;
  };
}

export async function renderReference(
  kind: string,
  name: string
): Promise<Reference> {
  const filePath = path.join(rootPath, "content", kind, `${name}.mdx`);
  const content = fs.readFileSync(filePath, "utf8");

  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        [
          require("remark-autolink-headings"),
          {
            linkProperties: {
              className: ["anchor"],
            },
            content: {
              type: "element",
              tagName: "span",
            },
          },
        ],
        withNextLinks,
      ],
      rehypePlugins: [],
    },
  });

  return {
    pagePath: `/reference/${kind}/${name}`,
    mdxSource,
    frontMatter: {
      title: name,
    },
  };
}
