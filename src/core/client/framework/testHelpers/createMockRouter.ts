export default function createMockRouter() {
  return {
    router: {
      addNavigationListener: jest.fn(),
      createHref: jest.fn(),
      createLocation: jest.fn(),
      go: jest.fn(),
      isActive: jest.fn(),
      matcher: {
        match: jest.fn(),
        getRoutes: jest.fn(),
        isActive: jest.fn(),
        format: jest.fn(),
      },
      push: jest.fn(),
      replace: jest.fn(),
      replaceRouterConfig: jest.fn(),
    },
    match: {
      context: undefined,
      location: {
        action: "",
        delta: 0,
        hash: "",
        index: 0,
        key: "",
        pathname: "",
        query: {},
        search: "",
        state: undefined,
      },
      params: {
        org: "",
        view: "",
      },
      route: {},
      routeIndices: [],
      routeParams: null,
      routes: [],
    },
  };
}
