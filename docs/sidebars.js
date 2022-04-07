module.exports = {
  docs: [
    {
      type: "category",
      label: "Getting Started",
      items: ["installation", "development"],
    },
    {
      type: "category",
      label: "Configuration",
      items: ["environment-variables", "administration", "cli"],
    },
    {
      type: "category",
      label: "Technical Integration",
      items: [
        "cms",
        "amp",
        "sso",
        "auth",
        "css",
        "counts",
        "notifications",
        "events",
        "gdpr",
        "slack",
        "mobile",
        "seo",
        "external-moderation-phases",
        "webhooks",
      ],
    },
    {
      type: "category",
      label: "FAQ & Troubleshooting",
      items: ["faq", "troubleshooting"],
    },
    {
      type: "category",
      label: "Migrating versions",
      items: ["migrating-from-4", "migrating-5-to-6", "migrating-6-to-7"],
    },
    {
      type: "doc",
      label: "Contact",
      id: "contact",
    },
    {
      type: "link",
      label: "Legacy Documentation",
      href: "https://legacy.docs.coralproject.net/talk/",
    },
  ],
  ...require("./docs/api/sidebar-schema"),
};
