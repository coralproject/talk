import cn from "classnames";
import Head from "next/head";
import { Router } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";

import reference from "../__generated__/reference/sidebar.json";

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
  const [navIsOpen, setNavIsOpen] = useState(false);

  // This will close the navigation bar when the user navigates to a new URL.
  // This ensures that when a user navigates, they don't have to close the
  // sidebar. This was coped from how Tailwind CSS's documentation does the same
  // thing.
  //
  // https://github.com/tailwindlabs/tailwindcss.com/blob/5355b9601e075609519b441cf591a700491dc317/src/pages/_app.js#L42-L51
  //
  useEffect(() => {
    if (!navIsOpen) {
      return;
    }

    function handleRouteChange() {
      setNavIsOpen(false);
    }

    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [navIsOpen]);

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
        <div className="lg:flex">
          <SidebarLayout
            nav={nav}
            currentPagePath={currentPagePath}
            navIsOpen={navIsOpen}
            setNavIsOpen={setNavIsOpen}
          />
          <div
            className={cn(
              "flex-auto flex flex-col min-w-0 lg:overflow-visible lg:max-h-full lg:static mb-20",
              {
                "overflow-hidden max-h-screen fixed": navIsOpen,
              }
            )}
          >
            <Callout />
            <article className="px-8">{children}</article>
          </div>
        </div>
      </main>
    </>
  );
};

export default DocumentationLayout;
