const typeDefs = [`
type UserSettings {
  bio: String
}

type User {
  id: ID!
  displayName: String!
  actions: [Action]
  settings: UserSettings
}

type Comment {
  id: ID!
  body: String!
  user: User
  replies(limit: Int = 3): [Comment]
  actions: [Action]
}

type Action {
  id: ID!
  item_id: ID!
  action_type: String!
  count: Int
  current_user: Action
  updated_at: String
  created_at: String
}

type Settings {
  moderation: String
  infoBoxEnable: Boolean
  infoBoxContent: String
  closeTimeout: Int
  closedMessage: String
  charCountEnable: Boolean
  charCount: Int
  requireEmailConfirmation: Boolean
}

type Asset {
  id: ID!
  title: String
  url: String
  comments: [Comment]
  settings: Settings!
}

type Query {
  settings: Settings
  assets: [Asset]
  asset(id: ID!): Asset
}

type Mutation {
  createComment(asset_id: ID!, parent_id: ID, body: String!): Comment
}

schema {
  query: Query
  mutation: Mutation
}
`];

module.exports = typeDefs;
