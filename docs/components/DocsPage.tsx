import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";
import { FunctionComponent } from "react";

import Callout from "./Callout";
import Header from "./Header";
import Layout from "./Layout";
import MDXComponents from "./MDXComponents";

export interface DocsPageProps {
  staticProps: {
    frontMatter: Record<string, any>;
    mdxSource: MdxRemote.Source;
    pagePath: string;
    filePath: string;
  };
}

const DocsPage: FunctionComponent<DocsPageProps> = ({
  staticProps: { frontMatter, mdxSource, pagePath },
}) => {
  // Note that the next-mdx-remote wraps the server components in an additional
  // div which will cause the error in the console:
  //
  //  Did not expect server HTML to contain a <div> in <div>.
  //
  // This is expected.
  const content = hydrate(mdxSource, {
    components: MDXComponents,
  });

  return (
    <Layout pagePath={pagePath}>
      <Callout />
      <article className="px-8">
        <Header
          title={frontMatter.title}
          description={frontMatter.description}
        />
        <div className="markdown">{content}</div>
      </article>
    </Layout>
  );
};

export default DocsPage;
