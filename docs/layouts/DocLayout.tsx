import Head from "next/head";
import { useRouter } from "next/router";
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
}

const DocLayout: FunctionComponent<Props> = ({ children, ...props }) => {
  const router = useRouter();
  let title = props.title;
  if (router.pathname !== "/") {
    title += ` - Coral Documentation`;
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
          <aside className="flex-none w-80 overflow-y-visible">
            <SidebarLayout nav={nav} />
          </aside>
          <div className="flex-auto flex flex-col">
            <Callout />
            <article className="px-8">{children}</article>
          </div>
        </div>
      </main>
    </>
  );
};

export default DocLayout;
