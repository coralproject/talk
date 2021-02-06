import fs from "fs";
import matter from "gray-matter";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";
import path from "path";

import MDXComponents from "../components/MDXComponents";
import withNextLinks from "../remark/withNextLinks";

const rootPath = path.join(process.cwd(), "docs", "content");

export interface Doc {
  frontMatter: Record<string, any>;
  mdxSource: MdxRemote.Source;
  filePath: string;
  pagePath: string;
}

export async function renderDoc(pagePath: string): Promise<Doc> {
  const filePath = path.join(rootPath, `${pagePath}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");

  const { data: frontMatter, content } = matter(source);
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
        require("remark-code-titles"),
        withNextLinks,
      ],
      rehypePlugins: [require("mdx-prism")],
    },
  });

  return {
    mdxSource,
    frontMatter,
    filePath: filePath.replace(`${rootPath}/`, ""),
    pagePath: `/${pagePath}`,
  };
}

export function getDocs() {
  const files = fs.readdirSync(rootPath);

  return files
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx/, ""),
    }));
}
