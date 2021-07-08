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
      ],
    },
    {
      type: "category",
      label: "FAQ & Troubleshooting",
      items: ["faq", "troubleshooting", "ie11"],
    },
    {
      type: "category",
      label: "Migrating versions",
      items: ["migrating-from-4", "migrating-5-to-6"],
    },
    {
      type: "doc",
      label: "Contact",
      id: "contact",
    },
  ],
  ...require("./docs/api/sidebar-schema"),
};
