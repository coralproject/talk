// TODO: Adjust `RootQuery.asset(id: ID, url: URL)` to instead be
// `RootQuery.asset(id: ID, url: URL!)` because we'll always need the url, if
// this change is done now everything will likely break on the front end.

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
  closedAt: String
}

scalar URL

type RootQuery {
  settings: Settings
  assets: [Asset]
  asset(id: ID, url: URL): Asset
  me: User
}

input CreateActionInput {
  # the type of action.
  action_type: ACTION_TYPE!

  # the type of the item.
  item_type: ITEM_TYPE!

  # the id of the item that is related to the action.
  item_id: ID!
}

input UpdateUserSettingsInput {
  # user bio
  bio: String!
}

type RootMutation {
  # creates a comment on the asset.
  createComment(asset_id: ID!, parent_id: ID, body: String!): Comment

  # creates an action based on an input.
  createAction(action: CreateActionInput!): Action

  # delete an action based on the action id.
  deleteAction(id: ID!): Boolean

  # updates a user's settings, it will return if the query was successful.
  updateUserSettings(settings: UpdateUserSettingsInput!): Boolean
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`];

module.exports = typeDefs;
