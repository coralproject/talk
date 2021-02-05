import Head from "next/head";
import { FunctionComponent } from "react";

import reference from "../data/__generated__/sidebar.json";

import Callout from "../components/Callout";
import Header from "../components/Header";
import data from "../data/nav.yml";
import SidebarLayout, { Nav } from "./SidebarLayout";

const nav: Nav = [
  // Include the static navigation from the provided YAML file.
  ...data.sidebar,
  // Include the GraphQL Reference last, and use the generated reference file.
  { title: "GraphQL Reference", items: reference },
];

interface Props {
  title: string;
  currentPagePath: string;
}

const DocumentationLayout: FunctionComponent<Props> = ({
  children,
  currentPagePath,
  ...props
}) => {
  let title = props.title;
  if (currentPagePath !== "/") {
    title += ` - Coral`;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta key="twitter:title" name="twitter:title" content={title} />
        <meta key="og:title" property="og:title" content={title} />
      </Head>
      <main className="text-gray-500">
        <Header />
        <div className="flex">
          <SidebarLayout nav={nav} currentPagePath={currentPagePath} />
          <div className="flex-auto flex flex-col">
            <Callout />
            <article className="px-8">{children}</article>
          </div>
        </div>
      </main>
    </>
  );
};

export default DocumentationLayout;
