const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Coral",
  tagline: "A better commenting experience from Vox Media",
  url: "https://docs.coralproject.net",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "coralproject",
  projectName: "talk",
  themeConfig: {
    algolia: {
      apiKey: "259b9f08146e7407341fa04498544ad6",
      indexName: "coralproject",
    },
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
          label: "Getting Started",
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
              to: "/docs/installation",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/coralproject",
            },
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
              label: "Blog",
              href: "https://coralproject.net/blog",
            },
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
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/coralproject/talk/edit/develop/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
