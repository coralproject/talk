import { GetStaticPaths, GetStaticProps } from "next";
import hydrate from "next-mdx-remote/hydrate";
import { ParsedUrlQuery } from "querystring";
import { FunctionComponent } from "react";

import MDXComponents from "../../../components/MDXComponents";
import DocumentationLayout from "../../../layouts/DocumentationLayout";
import {
  getReferences,
  Reference,
  renderReference,
} from "../../../lib/reference";

interface Props {
  reference: Reference;
}

const ReferencePage: FunctionComponent<Props> = ({
  reference: { mdxSource, pagePath, frontMatter },
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
      <div className="markdown">{content}</div>
    </DocumentationLayout>
  );
};

interface Params extends ParsedUrlQuery {
  kind: string;
  name: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  if (!params) {
    return { notFound: true };
  }

  const { kind, name } = params;

  const reference = await renderReference(kind, name);
  if (!reference) {
    return { notFound: true };
  }

  return {
    props: {
      reference,
    },
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const references = getReferences();

  return {
    paths: references.map(({ kind, name }) => ({
      params: {
        kind: kind.toLowerCase(),
        name,
      },
    })),
    fallback: false,
  };
};

export default ReferencePage;
