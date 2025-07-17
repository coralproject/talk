import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "Coral",
  tagline: "A better commenting experience from Vox Media",
  url: "https://docs.coralproject.net",
  baseUrl: "/",
  organizationName: "coralproject",
  projectName: "talk",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/coralproject/talk/edit/develop/docs/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      logo: {
        alt: "Coral by Vox Media",
        src: "img/coralproject_by_voxmedia.svg",
      },
      items: [
        {
          type: "doc",
          docId: "installation",
          position: "left",
          label: "Docs",
        },
        {
          type: "doc",
          docId: "api/schema",
          position: "left",
          label: "API",
        },
        {
          href: "https://github.com/coralproject/talk",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://hub.docker.com/r/coralproject/talk/",
          label: "Docker",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/coralproject/talk",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/coralproject/talk",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Vox Media, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
  plugins: [
    [
      "@graphql-markdown/docusaurus",
      {
        schema: "../server/src/core/server/graph/schema/schema.graphql",
        rootPath: "./docs",
        baseURL: "api",
        homepage: "./docs/graphql.md",
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
        },
        docOptions: {
          index: true,
        },
      },
    ],
    "docusaurus-lunr-search",
  ],
};

export default config;
