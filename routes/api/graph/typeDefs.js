const typeDefs = [`
type UserSettings {
  bio: String
}

type User {
  id: ID!
  displayName: String!
  actions: [ActionSummary]
  settings: UserSettings
}

type Comment {
  id: ID!
  body: String!
  user: User
  replies(limit: Int = 3): [Comment]
  actions: [ActionSummary]
}

enum ITEM_TYPE {
  ASSETS
  COMMENTS
  USERS
}

enum ACTION_TYPE {
  LIKE
  FLAG
}

interface ActionInterface {
  action_type: ACTION_TYPE!
  item_type: ITEM_TYPE!
}

type Action implements ActionInterface {
  id: ID!
  item_id: ID!
  action_type: ACTION_TYPE!
  item_type: ITEM_TYPE!
  user: User!
  updated_at: String
  created_at: String
}

type ActionSummary implements ActionInterface {
  action_type: ACTION_TYPE!
  item_type: ITEM_TYPE!
  count: Int
  current_user: Action
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
  currentUser: User
}

type Query {
  settings: Settings
  assets: [Asset]
  asset(id: ID!): Asset
  me: User
}

input CreateActionInput {
  action_type: ACTION_TYPE!
  item_type: ITEM_TYPE!
  item_id: ID!
}

input UpdateUserSettingsInput {
  bio: String!
}

type Mutation {
  createComment(asset_id: ID!, parent_id: ID, body: String!): Comment
  createAction(action: CreateActionInput!): Action
  deleteAction(id: ID!): Boolean

  updateUserSettings(settings: UpdateUserSettingsInput!): Boolean

}

schema {
  query: Query
  mutation: Mutation
}
`];

module.exports = typeDefs;
