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
      items: ["administration", "gdpr", "notifications", "slack"],
    },
    {
      type: "category",
      label: "Technical Integration",
      items: [
        "cms",
        "environment-variables",
        "cli",
        "sso",
        "auth",
        "css",
        "counts",
        "events",
        "seo",
        "mobile",
        "amp",
      ],
    },
    {
      type: "category",
      label: "FAQ & Troubleshooting",
      items: ["faq", "troubleshooting", "ie11"],
    },
  ],
  ...require("./docs/api/sidebar-schema"),
};
