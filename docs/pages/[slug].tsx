import { GetStaticPaths, GetStaticProps } from "next";
import hydrate from "next-mdx-remote/hydrate";
import { ParsedUrlQuery } from "querystring";
import { FunctionComponent } from "react";

import MDXComponents from "../components/MDXComponents";
import PageHeader from "../components/PageHeader";
import DocumentationLayout from "../layouts/DocumentationLayout";
import { Doc, getDocs, renderDoc } from "../lib/documentation";

interface Props {
  doc: Doc;
}

const DocPage: FunctionComponent<Props> = ({
  doc: { frontMatter, mdxSource, pagePath },
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
    <DocumentationLayout title={frontMatter.title} currentPagePath={pagePath}>
      <PageHeader
        title={frontMatter.title}
        description={frontMatter.description}
      />
      <div className="markdown">{content}</div>
    </DocumentationLayout>
  );
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const { slug } = params;

  const doc = await renderDoc(slug);

  return {
    props: {
      doc,
    },
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const pages = getDocs();

  return {
    paths: pages.map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
};

export default DocPage;
