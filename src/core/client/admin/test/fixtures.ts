export const settings = {
  auth: {
    displayName: {
      enabled: false,
    },
    integrations: {
      oidc: [],
      local: {
        enabled: true,
        allowRegistration: true,
        targetFilter: {
          admin: true,
          stream: true,
        },
      },
      sso: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          admin: true,
          stream: true,
        },
        key: null,
        keyGeneratedAt: null,
      },
      google: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          admin: true,
          stream: true,
        },
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost/google/callback",
      },
      facebook: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          admin: true,
          stream: true,
        },
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost/facebook/callback",
      },
    },
  },
};
