import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import {
  createRelayEnvironment,
  removeFragmentRefs,
} from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import { UserBoxContainer } from "./UserBoxContainer";

// Remove relay refs so we can stub the props.
const UserBoxContainerN = removeFragmentRefs(UserBoxContainer);
const context = {
  relayEnvironment: createRelayEnvironment({}),
};
jest.spyOn(React, "useContext").mockImplementation(() => context);

it("renders fully", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    viewer: null,
    settings: {
      " $data": {
        auth: {
          integrations: {
            facebook: {
              enabled: true,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            google: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            oidc: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            local: {
              enabled: true,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
          },
        },
      },
    },
    // eslint-disable-next-line no-empty
    showAuthPopup: async () => {},
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders without logout button", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    viewer: null,
    settings: {
      " $data": {
        auth: {
          integrations: {
            facebook: {
              enabled: true,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            google: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            oidc: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            local: {
              enabled: true,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
          },
        },
      },
    },
    // eslint-disable-next-line no-empty
    showAuthPopup: async () => {},
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders sso only", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    viewer: null,
    settings: {
      " $data": {
        auth: {
          integrations: {
            facebook: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            google: {
              enabled: true,
              allowRegistration: true,
              targetFilter: {
                stream: false,
              },
            },
            oidc: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            local: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
          },
        },
      },
    },
    // eslint-disable-next-line no-empty
    showAuthPopup: async () => {},
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders sso only without logout button", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    viewer: null,
    settings: {
      " $data": {
        auth: {
          integrations: {
            facebook: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            google: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            oidc: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            local: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
          },
        },
      },
    },
    // eslint-disable-next-line no-empty
    showAuthPopup: async () => {},
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders without register button", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    viewer: null,
    settings: {
      " $data": {
        auth: {
          integrations: {
            facebook: {
              enabled: true,
              allowRegistration: false,
              targetFilter: {
                stream: true,
              },
            },
            google: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: false,
              },
            },
            oidc: {
              enabled: false,
              allowRegistration: true,
              targetFilter: {
                stream: true,
              },
            },
            local: {
              enabled: true,
              allowRegistration: false,
              targetFilter: {
                stream: true,
              },
            },
          },
        },
      },
    },
    // eslint-disable-next-line no-empty
    showAuthPopup: async () => {},
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
