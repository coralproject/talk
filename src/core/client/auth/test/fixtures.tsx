export const settings = {
  auth: {
    integrations: {
      facebook: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
      },
      google: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
      },
      sso: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
      },
      local: {
        enabled: true,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
        },
      },
      oidc: [],
    },
  },
};
