export const settings = {
  id: "settings",
  auth: {
    integrations: {
      facebook: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
        redirectURL: "http://localhost/facebook",
      },
      google: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
        redirectURL: "http://localhost/google",
      },
      sso: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
      },
      oidc: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
        name: "OIDC",
        redirectURL: "http://localhost/oidc",
      },
      local: {
        enabled: true,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
      },
    },
  },
};
