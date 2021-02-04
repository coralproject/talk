import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

import DocsPage, { DocsPageProps } from "../components/DocsPage";
import { getPages, renderPage } from "../lib/page";

export default function DocsPageLayout(props: DocsPageProps) {
  return <DocsPage {...props} />;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<DocsPageProps, Params> = async ({
  params,
}) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const staticProps = await renderPage(params.slug);

  return {
    props: {
      staticProps,
    },
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const pages = getPages();

  return {
    paths: pages.map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
};
