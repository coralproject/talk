export const emptyModerationQueues = {
  reported: {
    count: 0,
    comments: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  },
  pending: {
    count: 0,
    comments: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  },
  unmoderated: {
    count: 0,
    comments: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  },
};

export const emptyRejectedComments = {
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
};

export const settings = {
  wordList: {
    banned: [],
    suspect: [],
  },
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

export const moderationActions = [
  {
    id: "07e8f815-e165-4b5d-b438-7163415c8cf7",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "luke2",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:51.897Z",
    status: "ACCEPTED",
    __typename: "CommentModerationAction",
  },
  {
    id: "6869314b-47ef-4cf9-b8ce-42b12bca8231",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "addy",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:45.644Z",
    status: "REJECTED",
    __typename: "CommentModerationAction",
  },
  {
    id: "caebbf7f-4813-42c0-ac3c-46b1be8199e0",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "dany",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:42.060Z",
    status: "ACCEPTED",
    __typename: "CommentModerationAction",
  },
  {
    id: "b2f92717-e4a8-4075-a543-95f7c5eaefb2",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "admin",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:34.539Z",
    status: "REJECTED",
    __typename: "CommentModerationAction",
  },
  {
    id: "9fb2ff3c-7105-4357-99e1-36cdeea49c75",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "mod245",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:30.648Z",
    status: "ACCEPTED",
    __typename: "CommentModerationAction",
  },
];
